"use client";

const workExperiences = [
  {
    company: "Datadog",
    role: "Software Engineering Intern",
    period: "Summer 2025",
    description: "Developed a Go-based MCP server with dynamic tool generation from protocol buffers, enabling LLM-driven interactions with Datadog's metrics platform infrastructure, sharding, and deployments.",
  },
  {
    company: "Rice University",
    role: "Undergraduate Researcher",
    period: "2023-2025",
    description: "Adapted the BLISS deep learning algorithm to implement class-incremental learning.",
  },
  {
    company: "Capella Space",
    role: "Software Engineering Intern",
    period: "Summer 2024",
    description: "Developed a Python library to streamline the creation and validation of spacecraft commands.",
  },
  {
    company: "GE Healthcare",
    role: "Software Engineering Intern",
    period: "Summer 2023",
    description: "Scaled and modernized the Emitter Calibration tool by migrating it to a microservices architecture and enabling reliable deployment on CT machines.",
  },
];

export function About() {
  const scrollToArt = () => {
    const artSection = document.getElementById('art-section');
    if (artSection) {
      artSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1  overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex items-start gap-30">
          <div className="flex-1 max-w-2xl">

            <div className="flex items-center gap-4">
              <img src="/icons/letter.png" alt="letter" className="w-18 h-15 mt-6 object-cover hover:-rotate-10 transition-all duration-100"/>
              <img src="/icons/hello.png" alt="hello" className="w-51 h-30 object-cover"/>
            </div>
            <div className="text-gray-600 text-xl mb-10 mt-10 relative">
              I'm a software engineer and recent graduate from Rice University currently based in the SF bay area. In addition to doodling in Microsoft Paint, I like to dabble in many forms of art, try the same drink at different coffee shops, and play pickleball and squash. Feel free to check out some of {' '}
              <span
                onClick={scrollToArt}
                className="text-[#948ab8] cursor-pointer hover:text-[#7092be] transition-colors"
              >
                my art and other projects below!
              </span>
              {' '}
            </div>
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6" style={{ color: "#7092be" }}>
                work experience
              </h3>
              <div className="flex flex-col gap-4">
                {workExperiences.map((experience, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg border-2 border-[#948ab8] p-5 shadow-sm hover:shadow-md hover:border-[#7092be] hover:translate-x-2 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{experience.role}</h4>
                        <p className="text-[#948ab8] font-medium">{experience.company}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {experience.period}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      {experience.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 relative">
            <img
              src="/pfp.jpg"
              alt="Profile Picture"
              className="w-80 h-90 object-cover rounded-[50%]"
              style={{ borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" }}
            />
            <img
              src="/icons/cloud.png"
              alt="Cloud overlay"
              className="absolute -top-0 -left-5 w-40 h-20 object-contain hover:-translate-x-5 transition-all duration-300"
            />
             <img
              src="/icons/cloud2.png"
              alt="Cloud overlay"
              className="absolute -bottom-0 -right-10 w-40 h-20 -rotate-5 object-contain hover:translate-x-5 transition-all duration-300"
            />
          </div>
        </div>
      </div>
      
      <Art />
    </div>
  );
}

const hennaImgCount = 12;
const graphicImgCount = 6;
const paintingImgCount = 12;
const pourPaintingImgCount = 12;


const hennaImages = Array.from(
  { length: hennaImgCount },
  (_, i) => `/art/mehendi/${i + 1}.jpg`
);
const graphicImages = Array.from(
  { length: graphicImgCount },
  (_, i) => `/art/graphic/${i + 1}.PNG`
);
const paintingImages = Array.from(
  { length: paintingImgCount },
  (_, i) => `/art/paintings/${i + 1}.jpg`
);
const pourPaintingImages = Array.from(
  { length: pourPaintingImgCount },
  (_, i) => `/art/pour/${i + 1}.jpg`
);

export function Art() {
  return (
    <div id="art-section" className="bg-[#dce8f5] p-8 border-t-2 border-[#b8d0ec]">
      <div className="max-w-7xl mx-auto">
        <div className="text-6xl font-bold mb-10 mt-12 text-[#948ab8]">
          art by me!!
        </div>
        <div className="text-gray-600 text-xl mb-10 mt-10">
          a collection of henna designs thanks to some generous hand models :)
        </div>
        <div className="columns-6 gap-4 space-y-4">
          {hennaImages.map((imagePath, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <img
                src={imagePath}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded border-2 border-gray-300 hover:scale-105 hover:shadow-md transition-transform duration-300"
              />
            </div>
          ))}
        </div>


        <div className="text-gray-600 text-xl mb-10 mt-10">
          acrylic & watercolor paintings over the years...
        </div>
        <div className="columns-6 gap-4 space-y-4">
          {paintingImages.map((imagePath, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <img
                src={imagePath}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded border-2 border-gray-300 hover:scale-105 hover:shadow-md transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="text-gray-600 text-xl mb-10 mt-10">
          some graphic art made on adobe illustrator!
        </div>
        <div className="columns-6 gap-4 space-y-4">
          {graphicImages.map((imagePath, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <img
                src={imagePath}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded border-2 border-gray-300 hover:scale-105 hover:shadow-md transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="text-gray-600 text-xl mb-10 mt-10">
          pour paintings - a special art technique where you mix, pour, and tilt thinned paint on a canvas
        </div>
        <div className="columns-6 gap-4 space-y-4">
          {pourPaintingImages.map((imagePath, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <img
                src={imagePath}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded border-2 border-gray-300 hover:scale-105 hover:shadow-md transition-transform duration-300"
              />
            </div>
          ))}
        </div>

      </div>
    </div>

  );
}

