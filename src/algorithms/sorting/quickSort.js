export const info = {
  name: "Quick Sort",
  best: "O(n log n)",
  average: "O(n log n)",
  worst: "O(n²)",
  space: "O(log n)",
};

function* partitionAndSort(a, lo, hi) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    yield { array: a.slice(), comparing: [j, hi], pivot: hi };
    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      yield { array: a.slice(), swapping: [i, j], pivot: hi };
    }
  }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
  yield { array: a.slice(), swapping: [i + 1, hi] };

  yield* partitionAndSort(a, lo, i);
  yield* partitionAndSort(a, i + 2, hi);
}

export function* quickSort(input) {
  const a = input.slice();
  yield* partitionAndSort(a, 0, a.length - 1);
  yield { array: a.slice(), sorted: Array.from({ length: a.length }, (_, k) => k) };
}
