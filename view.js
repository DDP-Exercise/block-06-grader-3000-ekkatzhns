/*Schreibe eine Methode, welche verwendet werden kann, um ein Punkte-Eingabefeld zu erstellen (bspw. für eine Klausur oder die Übungsaufgaben)
Schreibe eine Methode, welche verwendet werden kann, um die Anwesenheit einzutragen.
Schreibe zwei Methoden, die sich um die optische hervorhebung von negativen Ergebnissen und dem Streichergebnis kümmern
 */
'use strict';

export class GraderView {
    constructor() {
        this.exerciseContainer = document.querySelector("#exercise-inputs");
        this.examContainer = document.querySelector("#exam-input");
        this.attendanceContainer = document.querySelector("#attendance-input");

        this.exerciseGradeElement = document.querySelector("#exercise-grade");
        this.examGradeElement = document.querySelector("#exam-grade");
        this.attendanceResultElement = document.querySelector("#attendance-result");
        this.totalGradeElement = document.querySelector("#total-grade");
        this.finalMarkElement = document.querySelector("#final-mark");
        this.reasonsElement = document.querySelector("#reasons");
    }

    createPointsInput(labelText, id) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("input-wrapper");

        const label = document.createElement("label");
        label.textContent = labelText + ": ";
        label.setAttribute("for", id);

        const input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.min = 0;
        input.max = 100;
        input.value = 0;

        wrapper.append(label, input);

        return wrapper;
    }

    createAttendanceInput() {
        return this.createPointsInput("Anwesenheit in %", "attendance");
    }

    renderInputs() {
        for (let i = 0; i < 8; i++) {
            const exerciseInput = this.createPointsInput(
                `Übung ${i + 1}`,
                `exercise-${i}`
            );

            this.exerciseContainer.append(exerciseInput);
        }

        const examInput = this.createPointsInput("Klausur", "exam");
        this.examContainer.append(examInput);

        const attendanceInput = this.createAttendanceInput();
        this.attendanceContainer.append(attendanceInput);
    }

    highlightNegative(element, isNegative) {
        if (isNegative) {
            element.style.color = "red";
            element.style.fontWeight = "bold";
        } else {
            element.style.color = "green";
            element.style.fontWeight = "bold";
        }
    }

    highlightWorstExercise(worstExerciseIndex) {
        const exerciseWrappers = this.exerciseContainer.querySelectorAll(".input-wrapper");

        for (let i = 0; i < exerciseWrappers.length; i++) {
            exerciseWrappers[i].style.backgroundColor = "white";
            exerciseWrappers[i].style.textDecoration = "none";
            exerciseWrappers[i].style.opacity = "1";
        }

        if (exerciseWrappers[worstExerciseIndex]) {
            exerciseWrappers[worstExerciseIndex].style.backgroundColor = "#dddddd";
            exerciseWrappers[worstExerciseIndex].style.textDecoration = "line-through";
            exerciseWrappers[worstExerciseIndex].style.opacity = "0.7";
        }
    }

    renderResult(result) {
        this.highlightWorstExercise(result.worstExerciseIndex);

        this.exerciseGradeElement.textContent =
            `Übungsnote: ${result.exerciseGrade.toFixed(2)}%`;

        this.examGradeElement.textContent =
            `Klausurnote: ${result.exam}%`;

        this.attendanceResultElement.textContent =
            `Anwesenheit: ${result.attendance}%`;

        this.totalGradeElement.textContent =
            `Gesamtnote: ${result.totalGrade.toFixed(2)}%`;

        this.finalMarkElement.textContent =
            `Endnote: ${result.gradeName}`;

        this.highlightNegative(this.exerciseGradeElement, result.exerciseGrade <= 50);
        this.highlightNegative(this.examGradeElement, result.exam <= 50);
        this.highlightNegative(this.attendanceResultElement, result.attendance < 80);
        this.highlightNegative(this.finalMarkElement, !result.passed);

        this.reasonsElement.innerHTML = "";

        if (result.reasons.length > 0) {
            for (const reason of result.reasons) {
                const item = document.createElement("li");
                item.textContent = reason;
                item.style.color = "red";
                this.reasonsElement.append(item);
            }
        }
    }
}