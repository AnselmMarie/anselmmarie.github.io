import { Duration } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  type BehaviorOptions,
  CachePolicy,
  Function as CloudFrontFunction,
  Distribution,
  FunctionCode,
  FunctionEventType,
  FunctionRuntime,
  HttpVersion,
  type ICachePolicy,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { FunctionUrlOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import type { FunctionUrl } from 'aws-cdk-lib/aws-lambda';
import type { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { APEX_DOMAIN, REMOTES_PREFIX, WWW_DOMAIN } from '../site-config/site-config.js';
import { wwwRedirectSource } from '../www-redirect/www-redirect.js';

/**
 * D108 — error responses are cached for 0 seconds, so a retry after an origin
 * error reaches the origin instead of CloudFront's default 10-second cached error
 * (D106, Slice 8 verification 4).
 */
export const UNCACHED_ERROR_STATUSES = [400, 403, 404, 500, 502, 503, 504] as const;

export interface SiteDistributionProps {
  readonly bucket: IBucket;
  readonly shellUrl: FunctionUrl;
}

/**
 * The one distribution (D108). Behaviors are matched in the order they are
 * declared, so the pointer pattern must precede `/_remotes/*`, which would
 * otherwise swallow it and cache a pointer for a year: the R12 failure, where a
 * rollback reports success and nobody sees it.
 */
export class SiteDistribution extends Construct {
  readonly distribution: Distribution;
  readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: SiteDistributionProps) {
    super(scope, id);

    // D109 — DNS is at Cloudflare, so validation is a CNAME added by hand. The
    // stack waits on it: the first deploy does not finish until it is added.
    this.certificate = new Certificate(this, 'Certificate', {
      domainName: APEX_DOMAIN,
      subjectAlternativeNames: [WWW_DOMAIN],
      validation: CertificateValidation.fromDns(),
    });

    const wwwRedirect = new CloudFrontFunction(this, 'WwwRedirect', {
      comment: `301 ${WWW_DOMAIN} to ${APEX_DOMAIN} (D109)`,
      code: FunctionCode.fromInline(wwwRedirectSource()),
      runtime: FunctionRuntime.JS_2_0,
    });
    const functionAssociations = [
      { function: wwwRedirect, eventType: FunctionEventType.VIEWER_REQUEST },
    ];

    const bucketOrigin = S3BucketOrigin.withOriginAccessControl(props.bucket);
    const staticBehavior = (cachePolicy: ICachePolicy): BehaviorOptions => ({
      origin: bucketOrigin,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy,
      compress: true,
      functionAssociations,
    });

    this.distribution = new Distribution(this, 'Distribution', {
      comment: 'anselmmarie.com: shell on Lambda, remotes and static files on S3 (D108)',
      domainNames: [APEX_DOMAIN, WWW_DOMAIN],
      certificate: this.certificate,
      httpVersion: HttpVersion.HTTP2_AND_3,
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: FunctionUrlOrigin.withOriginAccessControl(props.shellUrl),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // GET/HEAD/OPTIONS only: a POST through a Lambda OAC needs the client to
        // send a payload hash, and the shell has no server functions (D108).
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        // A Function URL rejects a Host header that isn't its own.
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        compress: true,
        functionAssociations,
      },
      // ⚠️ Order is precedence. The pointer pattern first (D107).
      additionalBehaviors: {
        [`/${REMOTES_PREFIX}/*/remoteEntry.js`]: staticBehavior(CachePolicy.CACHING_DISABLED),
        [`/${REMOTES_PREFIX}/*`]: staticBehavior(CachePolicy.CACHING_OPTIMIZED),
        '/assets/*': staticBehavior(CachePolicy.CACHING_OPTIMIZED),
        '/images/*': staticBehavior(CachePolicy.CACHING_OPTIMIZED),
        '/remoteEntry-*.js': staticBehavior(CachePolicy.CACHING_OPTIMIZED),
      },
      errorResponses: UNCACHED_ERROR_STATUSES.map((httpStatus) => ({
        httpStatus,
        ttl: Duration.seconds(0),
      })),
    });
  }
}
