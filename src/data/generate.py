import re
import json
import openai
import time
import os

client = openai.OpenAI(api_key=os.environ.get('KEY'))

# Configuration
INPUT_FILE = 'all_chapters_combined.ts'
OUTPUT_FILE = 'vocabulary_b1_complete.ts'

def get_b1_example(word, translation, word_type, article):
    """
    Calls the LLM to generate a B1-level sentence.
    """
    prompt = (
        f"Generate a B1 German sentence for '{word}' ({translation}, {word_type}). "
        "Use complex grammar (sub-clauses). Return ONLY a JSON list: [\"German\", \"English\"]"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Efficient and cheap for 1600+ words
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        # Parse the response safely
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error for {word}: {e}")
        return ["Fehler beim Laden.", "Error loading."]

def process_vocabulary():
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {INPUT_FILE} not found.")
        return

    # Regex to match: ["Word", "Translation", "Type", "Article", "ExDE", "ExEN"]
    # Adjusting for potential whitespace and quotes
    pattern = r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\]'
    matches = re.findall(pattern, content)

    print(f"Found {len(matches)} entries. Starting conversion...")

    output_lines = [
        "export type Example = [string, string]; // [German, English]",
        "export type CompactWord = [",
        "  string,    // Word",
        "  string,    // Translation",
        "  string,    // Type (n, v, a, etc.)",
        "  string,    // Article",
        "  Example[]  // Array of example sentence pairs",
        "];\n",
        "export const vocabulary: CompactWord[] = ["
    ]

    for i, m in enumerate(matches):
        word, trans, w_type, article, old_de, old_en = m

        # Logic: If old examples exist, use them; otherwise, generate/placeholder
        if old_de and old_en:
            examples = [[old_de, old_en]]
        else:
            # Here you would trigger your B1 generation logic
            examples = [get_b1_example(word, trans, w_type, article)]

        # Format as JSON-like array for TS
        ex_json = json.dumps(examples, ensure_ascii=False)

        entry = f'  ["{word}", "{trans}", "{w_type}", "{article}", {ex_json}],'
        output_lines.append(entry)

        if i % 100 == 0:
            print(f"Processed {i} words...")

    output_lines.append("];")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(output_lines))

    print(f"Success! Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    process_vocabulary()
