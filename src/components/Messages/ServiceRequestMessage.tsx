const ServiceRequestMessage = ({ text }: { text: string }) => {
  // Check if this is a service request message
  if (!text.includes("SERVICE REQUEST") && !text.includes("**Service Request**")) {
    return null;
  }

  // Parse the service request message
  const lines = text.split("\n").filter((line) => line.trim());
  const sections: Record<string, string> = {};
  let currentSection = "";
  let notes = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("What I need")) {
      currentSection = "whatIneed";
      sections[currentSection] = lines[i + 1]?.trim() || "";
      i++;
    } else if (line.includes("Preferred Date")) {
      sections["date"] = line.replace(/.*Preferred Date:\s*/, "").trim();
    } else if (line.includes("Preferred Time")) {
      sections["time"] = line.replace(/.*Preferred Time:\s*/, "").trim();
    } else if (line.includes("Notes")) {
      currentSection = "notes";
      sections[currentSection] = line.replace(/.*Notes:\s*/, "").trim();
    } else if (line.includes("negotiate") || line.includes("Looking forward")) {
      notes = line;
    }
  }

  return (
    <div className="space-y-3 whitespace-normal break-words">
      <div className="flex items-center gap-2 font-semibold text-white">
        <span>📋</span>
        <span>Service Request</span>
      </div>

      {sections.whatIneed && (
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white/70 text-xs font-medium mb-1">📝 What I need:</p>
          <p className="text-white text-sm">{sections.whatIneed}</p>
        </div>
      )}

      <div className="space-y-2">
        {sections.date && (
          <div className="flex items-start gap-2 text-sm text-white">
            <span>📅</span>
            <span>{sections.date}</span>
          </div>
        )}
        {sections.time && (
          <div className="flex items-start gap-2 text-sm text-white">
            <span>⏰</span>
            <span>{sections.time}</span>
          </div>
        )}
        {sections.notes && (
          <div className="flex items-start gap-2 text-sm text-white">
            <span>📌</span>
            <span>{sections.notes}</span>
          </div>
        )}
      </div>

      {notes && (
        <div className="text-white/80 text-sm italic border-t border-white/20 pt-2">
          {notes}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestMessage;
