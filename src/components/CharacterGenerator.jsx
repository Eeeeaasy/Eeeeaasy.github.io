import { useState } from 'react';

export default function CharacterGenerator() {
  const peepHeads = ['curly', 'long', 'short', 'none'];
  const peepFacialHairs = ['beard', 'mustache', 'stacheBeard', 'none'];
  const peepEmotions = ['happy', 'sad', 'angry', 'surprised'];
  const peepAccessories = ['clearLenses', 'sunnies', 'shades', 'none'];
  const peepBodies = ['armCross', 'waving', 'standing', 'crossedArms'];

  const [selectedHead, setSelectedHead] = useState(peepHeads[0]);
  const [selectedFacialHair, setSelectedFacialHair] = useState(peepFacialHairs[0]);
  const [selectedEmotion, setSelectedEmotion] = useState(peepEmotions[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(peepAccessories[0]);
  const [selectedBody, setSelectedBody] = useState(peepBodies[0]);

  const characterDescription = (
    <div className="space-y-1.5 text-xs text-gray-400 font-mono leading-relaxed mt-4">
      <p><span className="text-[#38BDF8]"></span> head: <span className="text-[#A3E635]">"{selectedHead}"</span>,</p>
      <p><span className="text-[#38BDF8]"></span> emotion: <span className="text-[#A3E635]">"{selectedEmotion}"</span>,</p>
      <p><span className="text-[#38BDF8]"></span> facial_hair: <span className="text-[#A3E635]">"{selectedFacialHair}"</span>,</p>
      <p><span className="text-[#38BDF8]"></span> body: <span className="text-[#A3E635]">"{selectedBody}"</span></p>
    </div>
  );

  return (
    <section className="py-12 px-6 rounded-xl border border-dashed border-[#2A2C35] bg-[#1A1C23]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-serif font-extrabold text-[#D1D5DB] mb-3 tracking-tight">
          How to mix a Peep.
        </h2>
        <p className="text-gray-400 text-center max-w-2xl text-sm mb-12 font-serif leading-relaxed">
          创建一个角色很容易！使用这些表单控件来混合不同的嵌套组件，拼装出你的专属极客形象。
        </p>

        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          {/* 头像预览区 */}
          <div className="relative border-4 border-[#D1D5DB] rounded-full w-64 h-64 flex flex-col justify-center items-center p-4 bg-[#E5E7EB] shadow-[0_0_30px_rgba(56,189,248,0.15)] overflow-hidden shrink-0">
             <div className="text-center text-gray-800 z-10 w-full px-2">
               <p className="font-serif font-bold text-lg mb-1">Your Avatar</p>
               <p className="text-xs text-gray-500">(资产占位区)</p>
             </div>
          </div>
          
          {/* 描述代码区 */}
          <div className="bg-[#13151A] border border-[#2A2C35] rounded-lg p-5 w-full md:w-80 shadow-lg">
             <div className="flex gap-2 mb-3 border-b border-[#2A2C35] pb-3">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <p className="text-[#8B5CF6] font-mono text-sm font-bold">const <span className="text-[#D1D5DB]">myPeep</span> = {'{'}</p>
             {characterDescription}
             <p className="text-[#8B5CF6] font-mono text-sm font-bold mt-2">{'}'}</p>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 text-[#D1D5DB]">
          {[
            { label: '发型搭配', state: selectedHead, setState: setSelectedHead, options: peepHeads },
            { label: '表情搭配', state: selectedEmotion, setState: setSelectedEmotion, options: peepEmotions },
            { label: '胡子搭配', state: selectedFacialHair, setState: setSelectedFacialHair, options: peepFacialHairs },
            { label: '配件搭配', state: selectedAccessory, setState: setSelectedAccessory, options: peepAccessories },
            { label: '身体搭配', state: selectedBody, setState: setSelectedBody, options: peepBodies },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
                set_{item.label}
              </label>
              <select
                value={item.state}
                onChange={(e) => item.setState(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#2A2C35] bg-[#13151A] text-sm font-serif focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#D1D5DB] outline-none"
              >
                {item.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}