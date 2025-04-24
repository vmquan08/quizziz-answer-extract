// ==UserScript==
// @name         Quizizz Answer Extractor
// @namespace    https://quizizz.com/
// @version      2025-03-24
// @description  skibidi toilet
// @author       You
// @match        *://quizizz.com/*
// @grant        none
// @require    https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// ==/UserScript==

(function () {
    'use strict';
    

    let data = [["Question Text", "Question Type", "Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Correct Answer", "Time in seconds", "Image Link", "Answer explanation"]];

    function addExtractButton() {
        console.log("[Quizizz Answer Extractor] made by quan08 with love <3");

        const headerContainer = document.querySelector(".header-desc");
        if (!headerContainer) return;
        if (document.getElementById("extract-answer-btn")) return; 

        const extractButton = document.createElement("button");
        extractButton.id = "extract-answer-btn";
        extractButton.textContent = "💾";
    
        // Style nút cho đẹp
        extractButton.style.marginLeft = "16px";
        extractButton.style.padding = "8px";
        extractButton.style.border = "1px solid #ccc";
        extractButton.style.borderRadius = "8px";
        extractButton.style.cursor = "pointer";
        extractButton.style.backgroundColor = "#f7f7f7";

        extractButton.onclick = () => {
            data = [["Question Text", "Question Type", "Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Correct Answer", "Time in seconds", "Image Link", "Answer explanation"]];
            alert("đợi tí nhé...")
            nextQuestion();
        };

        headerContainer.appendChild(extractButton);
    }
    // lay du lieu
    function extractQuizzizAnswer() {
        const questionTextElement = document.querySelector(".question-container .question .text");
        let questionText = "";
        if (questionTextElement) {
            const paragraphs = questionTextElement.querySelectorAll("p");
            questionText = Array.from(paragraphs).map(p => p.innerText.trim()).join("\n");
        }

        const imageDiv = document.querySelector(".question-container .question .image");
        let imageLink = "";
        if (imageDiv && imageDiv.style.backgroundImage) {
            imageLink = imageDiv.style.backgroundImage
                .replace(/^url\(["']?/, '')
                .replace(/["']?\)$/, '');
        }        

        const optionElements = document.querySelectorAll(".options-container .option");
        let options = [];
        let correctAnswerIndex = [];

        optionElements.forEach((optEl, idx) => {
            let optionText = "";
    
            if (optEl.classList.contains("image-option")) {
                // is image
                const imgDiv = optEl.querySelector(".image");
                if (imgDiv && imgDiv.style.backgroundImage) {
                    optionText = imgDiv.style.backgroundImage
                        .replace(/^url\(["']?/, '')
                        .replace(/["']?\)$/, '');
                }
            } else {
                // is word
                const textEl = optEl.querySelector(".text p");
                if (textEl) optionText = textEl.innerText.trim();
            }
    
            if (optEl.classList.contains("is-correct")) {
                correctAnswerIndex.push(options.length + 1);
            }
    
            options.push(optionText);
        });

        let questionType = "Multiple Choice";

        if (correctAnswerIndex.length >= 2) {
            questionType = "Multiple Select";
        }

        // nhap vao data
        let row = [
            questionText, questionType,
            options[0] || "", options[1] || "", options[2] || "", options[3] || "", options[4] || "", correctAnswerIndex.join(",") || "", "30", imageLink, ""
        ];
        data.push(row);
    }

    function nextQuestion() {
        extractQuizzizAnswer();

        const nextButton = document.querySelector(".items.next.flex-view.all-center");
    
        if (!nextButton || nextButton.classList.contains("is-disabled")) {
            downloadCSV();
            return;
        }
    
        nextButton.click();
        setTimeout(nextQuestion, 1500);
    }

    function downloadCSV() {
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Quizizz Answers");
        XLSX.writeFile(wb, "answers.xlsx");
        alert("✅Đã tải xong");
    }

    const observer = new MutationObserver(addExtractButton);
    observer.observe(document.body, { childList: true, subtree: true });

    addExtractButton();
})();
