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
    <div className="space-y-2 whitespace-normal">
      <div className="flex items-center gap-2 font-semibold">
        <span>📋</span>
        <span>Service Request</span>
      </div>

      {sections.whatIneed && (
        <div className="opacity-90">
          <p className="text-xs font-medium mb-1">📝 What I need:</p>
          <p className="text-sm">{sections.whatIneed}</p>
        </div>
      )}

      <div className="space-y-1 text-sm">
        {sections.date && (
          <div className="flex items-start gap-2">
            <span>📅</span>
            <span>{sections.date}</span>
          </div>
        )}
        {sections.time && (
          <div className="flex items-start gap-2">
            <span>⏰</span>
            <span>{sections.time}</span>
          </div>
        )}
        {sections.notes && (
          <div className="flex items-start gap-2">
            <span>📌</span>
            <span>{sections.notes}</span>
          </div>
        )}
      </div>

      {notes && (
        <div className="text-sm italic opacity-90 border-t pt-2">
          {notes}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestMessage;
