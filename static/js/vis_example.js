let stepContent = {};

// Function to fetch and parse markdown content
async function loadMarkdownContent() {
    try {
        const response = await fetch('../example_1/example.md');
        const markdownContent = await response.text();
        return parseMarkdownSections(markdownContent);
    } catch (error) {
        console.error('Error loading markdown:', error);
        return {};
    }
}

// Function to parse markdown into sections
function parseMarkdownSections(markdown) {
    const sections = {};
    const lines = markdown.split('\n');
    let currentSection = '';
    let currentContent = [];

    lines.forEach(line => {
        if (line.startsWith('## ') || line.startsWith('### ')) {
            // If we were building a previous section, save it
            if (currentSection) {
                sections[currentSection] = currentContent.join('\n');
                currentContent = [];
            }
            currentSection = line.replace(/^##+ /, '').trim();
        } else if (currentSection) {
            currentContent.push(line);
        }
    });

    // Save the last section
    if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
    }

    return sections;
}

// Initialize content when page loads
async function initializeContent() {
    const sections = await loadMarkdownContent();
    
    // Add wrong prediction content
    const wrongPredictionContent = sections['Wrong Prediction from GPT-4o'] || '';
    document.getElementById('wrong-prediction-content').innerHTML = marked.parse(wrongPredictionContent);
    
    // Update stepContent with parsed markdown sections
    stepContent = {
        'step0': marked.parse(sections['Step 0: Initial Plan from Query Analyzer'] || ''),
        'step1-action': marked.parse(sections['Step 1: Action from Action Predictor'] || ''),
        'step1-command': marked.parse(sections['Step 1: Command from Command Generator'] || ''),
        'step1-result': marked.parse(sections['Step 1: Result from Command Executor'] || ''),
        'step1-verify': marked.parse(sections['Step 1: Verification from Context Verifier'] || ''),
        'step2-action': marked.parse(sections['Step 2: Action from Action Predictor'] || ''),
        'step2-command': marked.parse(sections['Step 2: Command from Command Generator'] || ''),    
        'step2-result': marked.parse(sections['Step 2: Result from Command Executor'] || ''),
        'step2-verify': marked.parse(sections['Step 2: Verification from Context Verifier'] || ''),
        'final-context': marked.parse(sections['Full Trajectory in the Context'] || ''),
        'final-summary': marked.parse(sections['Summary from Solution Summarizer'] || ''),
        'final': marked.parse(sections['Final Answer'] || ''),
    };

    // Trigger display of initial content
    const firstButton = document.querySelector('.step-button');
    if (firstButton) {
        firstButton.click();
    }
}

// Handle button clicks
function initializeButtonListeners() {
    document.querySelectorAll('.step-button').forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active state
            document.querySelectorAll('.step-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // Show content
            const stepId = button.dataset.step;
            const contentDiv = document.querySelector('.step-content');
            contentDiv.innerHTML = stepContent[stepId] || 'Content for this step will be added...';
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeContent();
    initializeButtonListeners();
});