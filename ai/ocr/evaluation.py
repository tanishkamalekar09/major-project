"""
Evaluation Module for Packaged Product OCR.

Calculates:
- Character Error Rate (CER) via Levenshtein edit distance
- Word Error Rate (WER)
- Key Field Recall (checks whether mandatory declarations like MRP, Dates, FSSAI are found)
- Detection count & Average confidence
"""

import re
from typing import List, Dict, Any, Tuple


def levenshtein_distance(s1: str, s2: str) -> int:
    """Standard dynamic programming Levenshtein edit distance."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                cost = 0
            else:
                cost = 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,       # Deletion
                dp[i][j - 1] + 1,       # Insertion
                dp[i - 1][j - 1] + cost # Substitution
            )
    return dp[m][n]


def calculate_cer(reference: str, hypothesis: str) -> float:
    """
    Calculate Character Error Rate (CER):
    CER = Levenshtein Distance / max(len(reference), 1)
    """
    ref_clean = re.sub(r"\s+", " ", reference.strip().lower())
    hyp_clean = re.sub(r"\s+", " ", hypothesis.strip().lower())

    if not ref_clean:
        return 0.0 if not hyp_clean else 1.0

    dist = levenshtein_distance(ref_clean, hyp_clean)
    return min(1.0, float(dist) / float(len(ref_clean)))


def calculate_wer(reference: str, hypothesis: str) -> float:
    """
    Calculate Word Error Rate (WER):
    WER = Word Levenshtein Distance / max(len(ref_words), 1)
    """
    ref_words = re.findall(r"\b\w+\b", reference.lower())
    hyp_words = re.findall(r"\b\w+\b", hypothesis.lower())

    if not ref_words:
        return 0.0 if not hyp_words else 1.0

    m, n = len(ref_words), len(hyp_words)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if ref_words[i - 1] == hyp_words[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            )

    dist = dp[m][n]
    return min(1.0, float(dist) / float(len(ref_words)))


def evaluate_sample(
    ocr_results: List[Dict[str, Any]],
    ground_truth_items: List[str]
) -> Dict[str, Any]:
    """
    Evaluate OCR output against a ground truth list of expected text segments.

    :param ocr_results: List of dicts with 'text', 'confidence', 'bbox'.
    :param ground_truth_items: List of ground-truth strings.
    :return: Metrics dictionary.
    """
    ocr_texts = [item["text"].strip() for item in ocr_results if item.get("text")]
    full_ocr_text = " ".join(ocr_texts)
    full_gt_text = " ".join(ground_truth_items)

    cer = calculate_cer(full_gt_text, full_ocr_text)
    wer = calculate_wer(full_gt_text, full_ocr_text)

    # Key entity matching recall: for each ground-truth item, check if it was detected (fuzzy threshold)
    matched_gt = 0
    gt_match_details = []

    for gt in ground_truth_items:
        gt_lower = gt.lower().strip()
        best_match_ratio = 0.0
        best_match_ocr = ""

        # Check exact substring containment first
        if gt_lower in full_ocr_text.lower():
            matched_gt += 1
            gt_match_details.append({"gt": gt, "status": "EXACT_FOUND", "matched_text": gt})
            continue

        # Check individual OCR line matches
        for ocr_t in ocr_texts:
            c_err = calculate_cer(gt_lower, ocr_t.lower())
            sim = 1.0 - c_err
            if sim > best_match_ratio:
                best_match_ratio = sim
                best_match_ocr = ocr_t

        if best_match_ratio >= 0.70:  # 70% character match
            matched_gt += 1
            gt_match_details.append({
                "gt": gt,
                "status": "FUZZY_MATCH",
                "similarity": round(best_match_ratio, 2),
                "matched_text": best_match_ocr
            })
        else:
            gt_match_details.append({
                "gt": gt,
                "status": "MISSED",
                "similarity": round(best_match_ratio, 2),
                "matched_text": best_match_ocr
            })

    recall = matched_gt / len(ground_truth_items) if ground_truth_items else 0.0
    avg_confidence = (
        sum(item["confidence"] for item in ocr_results) / len(ocr_results)
        if ocr_results else 0.0
    )

    return {
        "ground_truth_count": len(ground_truth_items),
        "detected_count": len(ocr_results),
        "matched_gt_count": matched_gt,
        "key_entity_recall": round(recall, 4),
        "character_error_rate": round(cer, 4),
        "word_error_rate": round(wer, 4),
        "average_confidence": round(avg_confidence, 4),
        "field_details": gt_match_details,
    }
