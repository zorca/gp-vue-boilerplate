export function generateStream (fn, options = {}) {
  let i = 0;
  const next = async (options) => {
    let output = await fn(i, options);
    i++;
    if (output.length) {
      return output;
    }
    return;
  };
  const iterator = generator(next, options);
  iterator.next();
  return iterator;
}

async function* generator (next, options) {
  let output;
  let input;
  while (true) {
    input = yield output;
    output = await next(input || options);
    if (!output) {
      return;
    }
  }
}
