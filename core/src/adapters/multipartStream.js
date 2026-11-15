
export async function* parseMultipartStream(stream, boundary) {
  const reader = stream.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');

  // Разделители в байтах
  const boundaryBytes = encoder.encode(`--${boundary}`);
  const headerEndBytes = encoder.encode('\r\n\r\n');
  const crlfBytes = encoder.encode('\r\n');

  let buffer = new Uint8Array(0);
  let state = 'SEARCH_BOUNDARY'; // Состояния: SEARCH_BOUNDARY, READ_HEADERS, READ_BODY
  let currentHeaders = null;

  // Вспомогательная функция объединения чанков
  function appendBuffer(newChunk) {
    const tmp = new Uint8Array(buffer.length + newChunk.length);
    tmp.set(buffer, 0);
    tmp.set(newChunk, buffer.length);
    buffer = tmp;
  }

  // Поиск подмассива байт в буфере
  function indexOfBytes(haystack, needle, start = 0) {
    for (let i = start; i <= haystack.length - needle.length; i++) {
      let found = true;
      for (let j = 0; j < needle.length; j++) {
        if (haystack[i + j] !== needle[j]) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
    return -1;
  }

  // Парсинг блока заголовков конкретной части
  function parseHeaders(headerBytes) {
    const text = decoder.decode(headerBytes);
    const headers = {};
    for (const line of text.split('\r\n')) {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim().toLowerCase();
        const val = line.slice(idx + 1).trim();
        headers[key] = val;
      }
    }
    return headers;
  }

  while (true) {
    const { done, value } = await reader.read();
    if (value) appendBuffer(value);

    let processed = true;
    while (processed) {
      processed = false;

      if (state === 'SEARCH_BOUNDARY') {
        const idx = indexOfBytes(buffer, boundaryBytes);
        if (idx !== -1) {
          // Проверяем, не конец ли это всего потока (--boundary--)
          const afterBoundary = idx + boundaryBytes.length;
          if (buffer.length >= afterBoundary + 2) {
            if (buffer[afterBoundary] === 45 && buffer[afterBoundary + 1] === 45) {
              return; // Конец потока (символы '--')
            }
            // Пропускаем boundary и перевод строки \r\n
            buffer = buffer.slice(afterBoundary + 2);
            state = 'READ_HEADERS';
            processed = true;
          }
        }
      }
      else if (state === 'READ_HEADERS') {
        const idx = indexOfBytes(buffer, headerEndBytes);
        if (idx !== -1) {
          const headerBytes = buffer.slice(0, idx);
          currentHeaders = parseHeaders(headerBytes);
          buffer = buffer.slice(idx + headerEndBytes.length);
          state = 'READ_BODY';
          processed = true;
        }
      }
      else if (state === 'READ_BODY') {
        // Тело заканчивается прямо перед \r\n--boundary
        const nextBoundaryIdx = indexOfBytes(buffer, boundaryBytes);
        if (nextBoundaryIdx !== -1) {
          // Убираем \r\n перед следующим boundary
          const bodyEnd = nextBoundaryIdx >= 2 ? nextBoundaryIdx - 2 : nextBoundaryIdx;
          const bodyBytes = buffer.slice(0, bodyEnd);

          yield {
            headers: currentHeaders,
            body: bodyBytes // Uint8Array (можно декодировать в JSON или сохранить как Blob)
          };

          buffer = buffer.slice(nextBoundaryIdx);
          currentHeaders = null;
          state = 'SEARCH_BOUNDARY';
          processed = true;
        }
      }
    }

    if (done) break;
  }
}

export function getBoundary(contentType) {
  if (!contentType) return null;
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  return match ? (match[1] || match[2]).trim() : null;
}

export function getFileName(contentType) {
  if (!contentType) return null;
  const match = contentType.match(/filename=(?:"([^"]+)"|([^;]+))/i);
  return match ? (match[1] || match[2]).trim() : null;
}
