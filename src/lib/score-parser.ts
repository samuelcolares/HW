export function scorerParser(score: number) {
  if (score <= 579) {
    return {
      bg: "bg-[#e63630]",
      text: "text-[#e63630]",
      tooltip: "Low",
    };
  }
  if (score <= 669) {
    return {
      bg: "bg-[#d67f30]",
      text: "text-[#d67f30]",
      tooltip: "Fair",
    };
  }
  if (score <= 739) {
    return {
      bg: "bg-[#f6c544]",
      text: "text-[#f6c544]",
      tooltip: "Good",
    };
  }
  if (score <= 799) {
    return {
      bg: "bg-[#6ec489]",
      text: "text-[#6ec489]",
      tooltip: "Great",
    };
  }
  if (score <= 850) {
    return {
      bg: "bg-[#438d5c]",
      text: "text-[#438d5c]",
      tooltip: "Exceptional",
    };
  }

  return {
    bg: "",
    text: "",
    tooltip: "Unknown",
  };
}
