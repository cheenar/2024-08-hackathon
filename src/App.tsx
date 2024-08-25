import { Camera, ChevronDown, ChevronRight, MessageSquare, PlusCircle } from "lucide-react";

const ClaudeInterface = () => {
  return (
    <>
      <div className="bg-[#efeee5] p-4 h-screen flex flex-col text-gray-600">
        {/* <header className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <ArrowLeft className="text-gray-600" />
            <ArrowRight className="text-gray-300" />
            <RefreshCw className="text-gray-600" />
          </div>
        </header> */}

        <main className="flex-grow flex flex-col items-center">
          <h1 className="text-2xl font-serif mb-2 text-gray-700">Clxxde</h1>
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm mb-4">Professional Plan</div>

          <h2 className="text-3xl font-serif mb-6 text-gray-700">
            <span className="text-orange-400 mr-2">✺</span>
            Good evening, Random
          </h2>

          <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-4 mb-6">
            <input
              type="text"
              placeholder="How can Claude help you today?"
              className="w-full p-2 text-gray-500 mb-4"
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-purple-600">Claude 3.5 Sonnet</div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center text-gray-600 text-sm">
                  <PlusCircle className="w-4 h-4 mr-1" /> Add content
                </button>
                <Camera className="text-gray-600 w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mb-6">
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">Generate excel formulas</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
              Extract insights from report
            </button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
              Provide stakeholder perspective
            </button>
          </div>

          <div className="bg-purple-100 text-purple-700 p-3 rounded-lg flex items-center mb-6 w-full max-w-2xl">
            <span className="bg-purple-700 text-white text-xs px-1 rounded mr-2">NEW</span>
            Introducing Projects
            <span className="ml-auto text-sm">Try it out</span>
          </div>

          <div className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                Your recent chats <ChevronDown className="w-4 h-4 ml-1" />
              </h3>
              <button className="text-purple-600 text-sm flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                "Personalized Programming Project",
                "Project Planning and Development",
                "Fungible Reservation Selling System",
                "Finding the Most Powerful Weapon",
                "Pros and Cons of a Tokyo Selling Program",
                "Limits on Messages to Claude",
              ].map((title, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg shadow-sm"
                >
                  <MessageSquare className="text-gray-400 w-5 h-5 mb-2" />
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-gray-500 mt-1">{index > 2 ? "2 months ago" : "1 month ago"}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ClaudeInterface;
