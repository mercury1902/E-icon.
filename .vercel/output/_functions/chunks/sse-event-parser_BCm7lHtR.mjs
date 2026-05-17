function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function appendChunkAndExtractSseEvents(buffer, chunk) {
  const source = buffer + normalizeLineEndings(chunk);
  const events = [];
  let cursor = 0;
  while (true) {
    const separatorIndex = source.indexOf("\n\n", cursor);
    if (separatorIndex === -1) {
      break;
    }
    const eventBlock = source.slice(cursor, separatorIndex);
    if (eventBlock.trim().length > 0) {
      events.push(eventBlock);
    }
    cursor = separatorIndex + 2;
    while (source[cursor] === "\n") {
      cursor += 1;
    }
  }
  return {
    events,
    remainder: source.slice(cursor)
  };
}
function extractDataPayloadFromSseEvent(eventBlock) {
  const dataLines = [];
  for (const rawLine of eventBlock.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith(":")) {
      continue;
    }
    if (line.startsWith("data:")) {
      const value = line.slice(5);
      dataLines.push(value.startsWith(" ") ? value.slice(1) : value);
    }
  }
  if (dataLines.length === 0) {
    return null;
  }
  return dataLines.join("\n");
}

export { appendChunkAndExtractSseEvents as a, extractDataPayloadFromSseEvent as e };
