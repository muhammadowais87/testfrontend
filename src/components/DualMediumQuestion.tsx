import {
  getQuestionStems,
  mergeMcqOptions,
  stripLeadingNumber,
} from "@/lib/questionDisplay";

const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);

type DualMediumQuestionProps = {
  text: string;
  urdu: string;
  index: number;
  dualMedium: string;
  type?: string;
  textClassName?: string;
  urduClassName?: string;
};

export default function DualMediumQuestion({
  text,
  urdu,
  index,
  dualMedium,
  type,
  textClassName = "text-[13px] font-medium text-gray-800",
  urduClassName = "text-[13px] text-gray-700",
}: DualMediumQuestionProps) {
  const { englishStem, urduStem, parsedText, parsedUrdu } = getQuestionStems(text, urdu);
  const mergedOptions = mergeMcqOptions(parsedText, parsedUrdu);
  const hasOptions = mergedOptions.some((o) => o.english || o.urdu);
  const urduFont = isUrdu(urduStem) ? "font-urdu" : "";

  const renderOptions = (lang: "english" | "urdu" | "dual") => {
    if (!hasOptions) return null;
    return (
      <div className={`mt-1 space-y-0.5 ${lang === "dual" ? "grid grid-cols-2 gap-2" : ""}`}>
        {mergedOptions.map((opt) => {
          const enVal = opt.english || opt.urdu;
          const urVal = opt.urdu || opt.english;
          if (lang === "english") {
            return (
              <p key={opt.key} className="text-[12px] text-gray-700">
                ({opt.key}) {enVal}
              </p>
            );
          }
          if (lang === "urdu") {
            return (
              <p key={opt.key} className={`text-[12px] text-gray-700 text-right ${urduFont}`} dir="rtl">
                ({opt.key}) {urVal}
              </p>
            );
          }
          return (
            <div key={opt.key} className="col-span-2 grid grid-cols-2 gap-2">
              <p className="text-[12px] text-gray-700">({opt.key}) {enVal}</p>
              <p className={`text-[12px] text-gray-700 text-right ${urduFont}`} dir="rtl">
                ({opt.key}) {urVal}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  if (dualMedium === "dual") {
    return (
      <div>
        {type && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-gray-800">
            {type}
          </span>
        )}
        <div className="grid grid-cols-2 gap-3 items-start">
          <div>
            <p className={textClassName}>{index}. {englishStem}</p>
            {renderOptions("english")}
          </div>
          <div>
            <p className={`${urduClassName} text-right ${urduFont}`} dir="rtl">
              {stripLeadingNumber(urduStem) ? `${index}. ${urduStem}` : ""}
            </p>
            {renderOptions("urdu")}
          </div>
        </div>
      </div>
    );
  }

  if (dualMedium === "english") {
    return (
      <div>
        {type && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-gray-800">
            {type}
          </span>
        )}
        <p className={textClassName}>{index}. {englishStem}</p>
        {renderOptions("english")}
      </div>
    );
  }

  return (
    <div>
      {type && (
        <span className="inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-gray-800">
          {type}
        </span>
      )}
      <p className={`${urduClassName} ${urduFont}`} dir={isUrdu(urduStem) ? "rtl" : "ltr"}>
        {index}. {urduStem || englishStem}
      </p>
      {renderOptions("urdu")}
    </div>
  );
}
