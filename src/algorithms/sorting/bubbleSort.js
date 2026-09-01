export const info = {
  name: "Bubble Sort",
  best: "O(n)",
  average: "O(n²)",
  worst: "O(n²)",
  space: "O(1)",
};

export function* bubbleSort(input) {
  const a = input.slice();
  const n = a.length;
  const sortedFrom = (i) => Array.from({ length: i }, (_, k) => n - 1 - k);

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: a.slice(), comparing: [j, j + 1], sorted: sortedFrom(i) };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swappedThisPass = true;
        yield { array: a.slice(), swapping: [j, j + 1], sorted: sortedFrom(i) };
      }
    }
    if (!swappedThisPass) break;
  }
  yield { array: a.slice(), sorted: Array.from({ length: n }, (_, k) => k) };
}
