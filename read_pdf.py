import PyPDF2

def read_pdf(file_path):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

print(read_pdf("j:\\Arnetic\\godown-mag\\Project_Brief_Smart_Ledger__Operations_Tracker.pdf"))
