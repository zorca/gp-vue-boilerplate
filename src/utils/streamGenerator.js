export function generateStream(fn) {
  let i = 0;
  const next = async () => {
    let data = await fn(i);
    i++;
    if (data.length) {
      return data;
    }
    return;
  };
  const iterator = generator(next);
  return iterator;
}

async function* generator(next) {
  let i = 0;
  while (true) {
    let result = await next();
    if (!result) {
      return;
    }
    yield result;
    i++;
    if (i > 100) {
      console.warn('frühzeitiges aussteigen');
      return;
    }
  }
}
