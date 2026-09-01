export const info = {
  name: "Merge Sort",
  best: "O(n log n)",
  average: "O(n log n)",
  worst: "O(n log n)",
  space: "O(n)",
};

export function* mergeSort(input) {
  const a = input.slice();
  const n = a.length;

  for (let width = 1; width < n; width *= 2) {
    for (let left = 0; left < n; left += 2 * width) {
      const mid = Math.min(left + width, n);
      const right = Math.min(left + 2 * width, n);
      const merged = [];
      let l = left, r = mid;

      while (l < mid && r < right) {
        yield { array: a.slice(), comparing: [l, r] };
        if (a[l] <= a[r]) merged.push(a[l++]);
        else merged.push(a[r++]);
      }
      while (l < mid) merged.push(a[l++]);
      while (r < right) merged.push(a[r++]);

      for (let k = 0; k < merged.length; k++) {
        a[left + k] = merged[k];
        yield { array: a.slice(), writing: [left + k] };
      }
    }
  }
  yield { array: a.slice(), sorted: Array.from({ length: n }, (_, k) => k) };
}
