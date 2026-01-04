import {
  // FileTextIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { Container } from '@radix-ui/themes';

import './hero-section.css';

export const HeroSection = () => {
  return (
    <>
      <div className="hero-section-container px-5">
        <Container size="4">
          <div className="h-screen">
            <div className="flex flex-col h-full">
              {/* @todo - will add this functionality later on */}
              {/* <div className="flex justify-end py-10">
                <label>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <MoonIcon />
                    <Switch defaultChecked /> <SunIcon /> Theme
                  </div>
                </label>
              </div> */}

              <div className="grow mb-10">
                <div className="flex flex-col justify-center w-full h-full">
                  <div className="h-2/5 relative min-h-40 bg-slate-200 bg-opacity-65 text-slate-800 rounded-2xl shadow-2xl">
                    <div className="p-7 min-h-40 h-full flex items-end">
                      <div>
                        <div className="text-5xl font-light">Anselm Marie</div>
                        <div className="text-2xl font-bold">
                          Senior Software Engineer
                        </div>
                        <div className="text-2xl font-bold">UI/UX designer</div>
                      </div>
                      <div className="border-solid border-2 border-gray-300 absolute inset-1 rounded-2xl"></div>
                    </div>
                  </div>

                  <div className="flex justify-center my-10">
                    <a
                      href="https://www.linkedin.com/in/anselm-marie/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedInLogoIcon
                        width="30"
                        height="30"
                        color="#1e293b"
                      />
                    </a>
                    <div className="mx-5">
                      <a
                        href="https://github.com/AnselmMarie"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GitHubLogoIcon
                          width="30"
                          height="30"
                          color="#1e293b"
                        />
                      </a>
                    </div>
                    {/* <a
                      className="flex items-center"
                      href="/pdf/anselm-marie-resume.pdf"
                      target="_blank"
                    >
                      <FileTextIcon width="30" height="30" color="#1e293b" />
                      <span className="text-slate-800">Resume</span>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
