import { createHash } from 'node:crypto';
import { CfnGuardrail, CfnGuardrailVersion } from 'aws-cdk-lib/aws-bedrock';
import { Construct } from 'constructs';

/** What the visitor sees when B2 intervenes. The chat client replaces it with its own copy (Slice 5). */
export const GUARDRAIL_BLOCKED_MESSAGE =
  "I can only help with questions about Anselm Marie's work and this site.";

/** B2's denied topics: enforced outside the model, so an injection that fools it still gets blocked. */
export const GUARDRAIL_DENIED_TOPICS: CfnGuardrail.TopicConfigProperty[] = [
  {
    name: 'GeneralCoding',
    type: 'DENY',
    definition:
      "Requests to write, debug or explain code, scripts or commands that are not about Anselm Marie's own projects.",
    examples: ['Write me a Python script that scrapes a website', 'Fix this React bug for me'],
  },
  {
    name: 'Homework',
    type: 'DENY',
    definition: 'Requests to solve homework, exams, essays, math problems or other assignments.',
    examples: ['Solve this calculus problem', 'Write my essay about the French Revolution'],
  },
  {
    name: 'UnrelatedPeopleAndCompanies',
    type: 'DENY',
    definition:
      "Questions about people, companies or products that have nothing to do with Anselm Marie's work or this portfolio.",
    examples: ['What do you think of Elon Musk?', 'Compare the iPhone and the Pixel'],
  },
  {
    name: 'Politics',
    type: 'DENY',
    definition: 'Political opinions, elections, politicians, parties, or government policy.',
    examples: ['Who should I vote for?', 'What do you think about the new tax law?'],
  },
];

const HARM_FILTERS = ['SEXUAL', 'VIOLENCE', 'HATE', 'INSULTS', 'MISCONDUCT'] as const;

/**
 * B2's content filters. The prompt-attack filter applies to input only; Bedrock
 * requires its output strength to be NONE.
 */
export const GUARDRAIL_CONTENT_FILTERS: CfnGuardrail.ContentFilterConfigProperty[] = [
  ...HARM_FILTERS.map((type) => ({ type, inputStrength: 'HIGH', outputStrength: 'HIGH' })),
  { type: 'PROMPT_ATTACK', inputStrength: 'HIGH', outputStrength: 'NONE' },
];

/**
 * The Bedrock Guardrail the handler passes as `guardrailConfig` (B2), and the
 * numbered version it calls.
 *
 * ⚠️ **A version is a snapshot.** Editing the guardrail changes only its
 * DRAFT; the handler keeps calling the old version until a new one is cut. So
 * the version's description carries a hash of the config: any change to a
 * topic or filter changes the hash, CloudFormation replaces the version, and
 * the function's env picks up the new number in the same deploy.
 */
export class ChatGuardrail extends Construct {
  readonly guardrail: CfnGuardrail;
  readonly version: CfnGuardrailVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const config = {
      topicPolicyConfig: { topicsConfig: GUARDRAIL_DENIED_TOPICS },
      contentPolicyConfig: { filtersConfig: GUARDRAIL_CONTENT_FILTERS },
      blockedInputMessaging: GUARDRAIL_BLOCKED_MESSAGE,
      blockedOutputsMessaging: GUARDRAIL_BLOCKED_MESSAGE,
    };

    this.guardrail = new CfnGuardrail(this, 'Guardrail', {
      name: 'portfolio-chat',
      description: 'Keeps the portfolio chat on topic (ai-chat B2)',
      ...config,
    });

    const configHash = createHash('sha256').update(JSON.stringify(config)).digest('hex');
    this.version = new CfnGuardrailVersion(this, 'Version', {
      guardrailIdentifier: this.guardrail.attrGuardrailId,
      description: `config ${configHash.slice(0, 12)}`,
    });
  }
}
