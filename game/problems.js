/* Curated, verified practice content for the GitHub Pages MVP.
   A static website cannot keep reference code confidential from developer tools;
   the game NEVER displays this data directly. A server-side AI solver is future work. */
window.PUZZLE_PROBLEMS = [
 {
  id:"duplicate",title:"Contains Duplicate",topic:"Arrays & Hashing",difficulty:"Easy",fn:"contains_duplicate",
  statement:"Given an integer array <code>nums</code>, return <code>True</code> if any value appears at least twice. Otherwise return <code>False</code>.",
  example:"Input: nums = [1, 2, 3, 1]\nOutput: True\nWhy: The value 1 appears twice.",
  signature:"def contains_duplicate(nums):",
  code:"def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False",
  blocks:["    seen = set()","    for num in nums:\n        if num in seen:\n            return True","        seen.add(num)","    return False"],
  understand:["Identify the input: a list of integers.","Identify the output: a Boolean.","Understand the rule: repeated values make the result True.","Check edge cases: empty and one-item arrays have no duplicates."],
  plan:["Choose a set to remember values already visited.","Scan the array one value at a time.","Before storing a value, check whether it was seen before.","Record unseen values; return False only after the full scan."],
  hints:["What should the program remember while scanning the numbers?","The timing of the membership check matters. Compare [1, 1] with [1, 2].","A value should be checked against earlier elements—not against itself.","If every number is unique, when can you safely return False?"],
  mask:[5],
  tests:[{args:[[1,2,3,1]],expected:true},{args:[[1,2,3,4]],expected:false},{args:[[]],expected:false},{args:[[5,5]],expected:true},{args:[[-1,0,-1]],expected:true},{args:[[0]],expected:false}]
 },
 {
  id:"two-sum",title:"Two Sum",topic:"Arrays & Hashing",difficulty:"Easy",fn:"two_sum",
  statement:"Given <code>nums</code> and an integer <code>target</code>, return indices of the two distinct elements whose sum equals the target. Each input has exactly one answer; do not reuse an index.",
  example:"Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nWhy: nums[0] + nums[1] = 9",
  signature:"def two_sum(nums, target):",
  code:"def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        need = target - num\n        if need in seen:\n            return [seen[need], i]\n        seen[num] = i\n    return []",
  blocks:["    seen = {}","    for i, num in enumerate(nums):\n        need = target - num","        if need in seen:\n            return [seen[need], i]","        seen[num] = i","    return []"],
  understand:["Identify the input: integer array and target sum.","Identify the output: two different indices.","Recognize the condition: selected values add up to target.","Consider duplicate numbers and why an index cannot be reused."],
  plan:["Create a map from previously seen values to their indices.","Walk through the numbers while retaining each index.","Compute the complement needed to reach the target.","Check whether the complement exists before saving the current value."],
  hints:["Instead of searching every pair, what is missing from the target after seeing a value?","The map should represent numbers you encountered earlier, with their indices.","Check the complement before recording the current number to avoid reusing an element.","For [3, 3] and target 6, when does the first 3 become available?"],
  mask:[4],
  tests:[{args:[[2,7,11,15],9],expected:[0,1]},{args:[[3,2,4],6],expected:[1,2]},{args:[[3,3],6],expected:[0,1]},{args:[[0,4,3,0],0],expected:[0,3]},{args:[[-1,-2,-3,-4,-5],-8],expected:[2,4]}]
 },
 {
  id:"anagram",title:"Valid Anagram",topic:"Arrays & Hashing",difficulty:"Easy",fn:"is_anagram",
  statement:"Given two strings <code>s</code> and <code>t</code>, return <code>True</code> if they contain the same characters with the same frequencies, regardless of order.",
  example:"Input: s = 'anagram', t = 'nagaram'\nOutput: True\nWhy: Character counts match.",
  signature:"def is_anagram(s, t):",
  code:"def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    for ch in t:\n        counts[ch] = counts.get(ch, 0) - 1\n    return all(v == 0 for v in counts.values())",
  blocks:["    if len(s) != len(t):\n        return False","    counts = {}","    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1","    for ch in t:\n        counts[ch] = counts.get(ch, 0) - 1","    return all(v == 0 for v in counts.values())"],
  understand:["Identify the input: two character strings.","Identify the output: a Boolean.","Define anagrams: same frequencies of all characters.","Check when different lengths make an answer impossible."],
  plan:["Reject unequal-length strings immediately.","Count the characters in the first string.","Subtract matching character frequencies using the second string.","Accept only when every final count is zero."],
  hints:["What quick check can rule out some inputs without counting?","Two strings can have identical lengths but different letter frequencies.","One pass can add counts, and the other pass can subtract counts.","For s='aacc' and t='ccac', is every final count zero?"],
  mask:[5],
  tests:[{args:["anagram","nagaram"],expected:true},{args:["rat","car"],expected:false},{args:["aacc","ccac"],expected:false},{args:["",""],expected:true},{args:["a","aa"],expected:false},{args:["aabbcc","baccab"],expected:true}]
 },
 {
  id:"binary-search",title:"Binary Search",topic:"Binary Search",difficulty:"Easy",fn:"binary_search",
  statement:"You are given an ascending sorted list of distinct integers <code>nums</code> and a <code>target</code>. Return the target's index, or <code>-1</code> if absent. Aim for logarithmic time.",
  example:"Input: nums = [1, 3, 5, 7, 9], target = 7\nOutput: 3",
  signature:"def binary_search(nums, target):",
  code:"def binary_search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target:\n            return m\n        if nums[m] < target:\n            l = m + 1\n        else:\n            r = m - 1\n    return -1",
  blocks:["    l, r = 0, len(nums) - 1","    while l <= r:\n        m = (l + r) // 2","        if nums[m] == target:\n            return m","        if nums[m] < target:\n            l = m + 1\n        else:\n            r = m - 1","    return -1"],
  understand:["Identify the input: sorted distinct integers and a target.","Identify the output: index or -1.","Use the sorted order to eliminate impossible ranges.","Account for empty arrays and missing targets."],
  plan:["Initialize left and right boundaries around the candidate range.","Repeat while the candidate range is non-empty.","Compare the midpoint against the target.","Shrink the appropriate half without keeping the checked midpoint."],
  hints:["What property of a sorted array helps you discard half the candidates?","Check the relationship among left, right and midpoint.","After checking a midpoint, should a discarded half still contain that position?","Try a one-element array and an empty array to inspect your stopping condition."],
  mask:[3],
  tests:[{args:[[1,3,5,7,9],7],expected:3},{args:[[1,3,5,7,9],6],expected:-1},{args:[[],4],expected:-1},{args:[[3],3],expected:0},{args:[[3],4],expected:-1},{args:[[-3,-1,0,4,10],-3],expected:0}]
 },
 {
  id:"consecutive",title:"Longest Consecutive Sequence",topic:"Arrays & Hashing",difficulty:"Medium",fn:"longest_consecutive",
  statement:"Given an unsorted list of integers <code>nums</code>, find the length of its longest run of consecutive integer values. Duplicates do not increase its length. Aim for linear time.",
  example:"Input: nums = [100, 4, 200, 1, 3, 2]\nOutput: 4\nWhy: [1, 2, 3, 4] is the longest run.",
  signature:"def longest_consecutive(nums):",
  code:"def longest_consecutive(nums):\n    values = set(nums)\n    best = 0\n    for num in values:\n        if num - 1 not in values:\n            length = 1\n            while num + length in values:\n                length += 1\n            best = max(best, length)\n    return best",
  blocks:["    values = set(nums)\n    best = 0","    for num in values:\n        if num - 1 not in values:","            length = 1","            while num + length in values:\n                length += 1","            best = max(best, length)","    return best"],
  understand:["Identify the input: an unsorted integer list.","Identify the output: the length of the longest consecutive run.","Understand that a run is about values, not original positions.","Recognize that duplicates must not inflate the count."],
  plan:["Put values in a set for fast membership checks.","Only begin counting at the start of a run.","Extend a run while the next integer exists.","Update the best length and return it after inspecting all starts."],
  hints:["Can you check whether a value exists without sorting the whole array?","What makes a number the beginning of a run rather than its middle?","If you start counting at every number, how much repeated work occurs?","A run beginning at x continues while x + length still exists."],
  mask:[7],
  tests:[{args:[[100,4,200,1,3,2]],expected:4},{args:[[]],expected:0},{args:[[0,3,7,2,5,8,4,6,0,1]],expected:9},{args:[[1,2,0,1]],expected:3},{args:[[-2,-1,0,2]],expected:3},{args:[[10]],expected:1}]
 }
];