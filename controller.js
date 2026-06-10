/*Integriere Model und View
Organisiere alle nötigen Event-Listener (so effizient wie möglich) auf Eingabefelder. Wenn sie sich ändern, soll der Controller Änderungen entsprechend an das Model weitergeben.
Stelle sicher, dass der Controller reagiert, wenn sich die Gesamtnoten im Model ändern und das entsprechend an die View kommuniziert (hinweis: Custom Event).
 */

'use strict';
export class GraderController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    init() {

        this.view.renderInputs();
        this.addInputListeners();
        this.model.addEventListener("gradeChanged", (event) => {
            this.view.renderResult(event.detail);
        });
        this.view.renderResult(this.model.getResult());

    }

    addInputListeners() {

        document.addEventListener("change", (event) => {

            const input = event.target;
            if (input.tagName !== "INPUT") {
                return;
            }
            const value = Number(input.value);
            if (value < 0) {
                input.value = 0;
            }
            if (value > 100) {
                input.value = 100;
            }

            const correctedValue = Number(input.value);

            if (input.id.startsWith("exercise-")) {
                const index = Number(input.id.split("-")[1]);
                this.model.setExercisePoints(index, correctedValue);
            }

            if (input.id === "exam") {
                this.model.setExamPoints(correctedValue);
            }
            if (input.id === "attendance") {
                this.model.setAttendance(correctedValue);

            }

        });

    }

}