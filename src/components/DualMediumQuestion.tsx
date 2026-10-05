import {
  getQuestionStems,
  mergeMcqOptions,
  sanitizeOptionValue,
  stripLeadingNumber,
  splitVerseText,
} from "@/lib/questionDisplay";
import MathText, { getEnglishOnlyTokens } from "@/components/MathText";

const isUrdu = (text: string) => /[؀-ۿ]/.test(text);

type DualMediumQuestionProps = {
  text: string;
  urdu: string;
  index: number;
  dualMedium: string;
  type?: string;
  imageFile?: string | null;
  textClassName?: string;
  urduClassName?: string;
};

export default function DualMediumQuestion({
  text,
  urdu,
  index,
  dualMedium,
  type,
  imageFile,
  textClassName = "text-[13px] font-medium text-gray-800",
  urduClassName = "text-[13px] text-gray-700",
}: DualMediumQuestionProps) {
  const { englishStem, urduStem, parsedText, parsedUrdu } = getQuestionStems(text, urdu);
  const mergedOptions = mergeMcqOptions(parsedText, parsedUrdu);
  const hasOptions = mergedOptions.some((o) => o.english || o.urdu);
  const urduFont = isUrdu(urduStem) ? "font-urdu" : "";
  // Math tokens removed from English as PDF artifacts that are missing from Urdu
  const urduSupplement = urduStem ? getEnglishOnlyTokens(englishStem, urduStem) : [];

  const englishMisras = splitVerseText(englishStem);
  const urduMisras = splitVerseText(urduStem);
  const isVerse = englishMisras.length > 1 || urduMisras.length > 1;

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
                ({opt.key}) <MathText text={sanitizeOptionValue(enVal, "english")} />
              </p>
            );
          }
          if (lang === "urdu") {
            return (
              <p key={opt.key} className={`text-[12px] text-gray-700 text-right ${urduFont}`} dir="rtl">
                ({opt.key}) <MathText text={sanitizeOptionValue(urVal, "urdu")} />
              </p>
            );
          }
          return (
            <div key={opt.key} className="col-span-2 grid grid-cols-2 gap-2">
              <p className="text-[12px] text-gray-700">({opt.key}) <MathText text={enVal} /></p>
              <p className={`text-[12px] text-gray-700 text-right ${urduFont}`} dir="rtl">
                ({opt.key}) <MathText text={urVal} />
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const diagramImg = imageFile ? (
    <img
      src={`/diagrams/${imageFile}`}
      alt="diagram"
      className="mt-2 max-h-40 object-contain rounded"
    />
  ) : null;

  const renderVerseMisras = (misras: string[], idx: number, prefix: string) => {
    const parts: React.ReactNode[] = [];
    parts.push(<span key="idx">{idx}{prefix}</span>);
    misras.forEach((m, i) => {
      if (i > 0) parts.push(<span key={`sep-${i}`} className="text-gray-400 mx-1">|</span>);
      parts.push(<span key={`m-${i}`} className="whitespace-nowrap">{m}</span>);
    });
    return <span className="inline-flex items-center gap-1 flex-wrap">{parts}</span>;
  };

  const renderEnglishStem = () => {
    if (isVerse) {
      return renderVerseMisras(englishMisras, index, ".");
    }
    return <>{index}. <MathText text={englishStem} /></>;
  };

  const renderUrduStem = () => {
    if (isVerse) {
      return renderVerseMisras(urduMisras.length > 1 ? urduMisras : englishMisras, index, "۔");
    }
    return <>{index}۔ <MathText text={urduStem} /></>;
  };

  if (dualMedium === "dual") {
    const hasUrdu = !!stripLeadingNumber(urduStem);
    return (
      <div>
        {type && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-gray-800">
            {type}
          </span>
        )}
        {/* English — full width */}
        <p className={textClassName}>
          {renderEnglishStem()}
        </p>
        {renderOptions("english")}
        {diagramImg}
        {/* Urdu — full width below, separated by a hairline */}
        {hasUrdu && (
          <p className={`${urduClassName} text-right ${urduFont} mt-0.5 pt-0.5 border-t border-gray-200`} dir="rtl">
            {renderUrduStem()}
            {urduSupplement.length > 0 && (
              <span dir="ltr" className="ml-1">{urduSupplement.join(" ")}</span>
            )}
          </p>
        )}
        {hasUrdu && renderOptions("urdu")}
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
        <p className={textClassName}>
          {renderEnglishStem()}
        </p>
        {renderOptions("english")}
        {diagramImg}
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
        {isVerse ? renderUrduStem() : <>{index}. <MathText text={urduStem || englishStem} /></>}
        {urduSupplement.length > 0 && (
          <span dir="ltr" className="ml-1">{urduSupplement.join(" ")}</span>
        )}
      </p>
      {renderOptions("urdu")}
      {diagramImg}
    </div>
  );
}
