/*Bereite Speicher für alle Noten und die Anwesenheitspflicht vor
Ein Array für die acht Übungsnoten
Eine Klausurnote
Schreibe eine Methode, die es dem Controller erlauben wird, Übungen mit Punkten zu bewerten
Schreibe eine Methode, die es dem Controller erlauben wird, die Klausur mit Punkten zu bewerten.
Schreibe eine Methode, die es dem Controller erlauben wird, die Anwesenheit einzutragen.
Schreibe eine Methode, die überprüft, ob ein Punktewert positiv ist.
Schreibe eine Methode zur Berechnung der Gesamtübungsnote
Schreibe eine Methode zur Berechnung der Gesamtnote
 */
'use strict';


export class GraderModel extends EventTarget {
    constructor() {
        super();

        this.exercises = [0, 0, 0, 0, 0, 0, 0, 0];
        this.exam = 0;
        this.attendance = 0;
    }
    setExercisePoints(index, points) {
        this.exercises[index] = points;
        this.notifyChange();
    }
    setExamPoints(points) {
        this.exam = points;
        this.notifyChange();
    }
    setAttendance(percent) {
        this.attendance = percent;
        this.notifyChange();
    }

    isPositive(points) {
        return points > 50;
    }
    getWorstExerciseIndex() {
        let worstIndex = 0;

        for (let i = 1; i < this.exercises.length; i++) {
            if (this.exercises[i] < this.exercises[worstIndex]) {
                worstIndex = i;
            }
        }

        return worstIndex;
    }

    calculateExerciseGrade() {
        const worstIndex = this.getWorstExerciseIndex();
        let sum = 0;

        for (let i = 0; i < this.exercises.length; i++) {
            if (i !== worstIndex) {
                sum = sum + this.exercises[i];
            }
        }

        const maxPoints = (this.exercises.length - 1) * 100;
        const exerciseGrade = (sum / maxPoints) * 100;

        return exerciseGrade;
    }

    countPositiveExercises() {
        let count = 0;

        for (const points of this.exercises) {
            if (this.isPositive(points)) {
                count++;
            }
        }

        return count;
    }

    calculateTotalGrade() {
        const exerciseGrade = this.calculateExerciseGrade();
        const examGrade = this.exam;

        const totalGrade = exerciseGrade * 0.6 + examGrade * 0.4;

        return totalGrade;
    }

    getGradeName(percent) {
        if (percent <= 50) {
            return "Nicht Genügend";
        }

        if (percent <= 61) {
            return "Genügend";
        }

        if (percent <= 74) {
            return "Befriedigend";
        }

        if (percent <= 86) {
            return "Gut";
        }

        return "Sehr gut";
    }

    getResult() {
        const exerciseGrade = this.calculateExerciseGrade();
        const totalGrade = this.calculateTotalGrade();
        const worstExerciseIndex = this.getWorstExerciseIndex();

        const positiveExercises = this.countPositiveExercises();
        const neededPositiveExercises = Math.ceil(this.exercises.length * 0.75);

        const reasons = [];

        if (!this.isPositive(exerciseGrade)) {
            reasons.push("Übungsnote ist negativ.");
        }

        if (!this.isPositive(this.exam)) {
            reasons.push("Klausur ist negativ.");
        }

        if (positiveExercises < neededPositiveExercises) {
            reasons.push("Weniger als 75% der Übungen sind positiv.");
        }

        if (this.attendance < 80) {
            reasons.push("Anwesenheit ist unter 80%.");
        }

        const passed = reasons.length === 0;

        return {
            exercises: this.exercises,
            exam: this.exam,
            attendance: this.attendance,
            exerciseGrade: exerciseGrade,
            totalGrade: totalGrade,
            worstExerciseIndex: worstExerciseIndex,
            positiveExercises: positiveExercises,
            neededPositiveExercises: neededPositiveExercises,
            passed: passed,
            gradeName: passed ? this.getGradeName(totalGrade) : "Nicht Genügend",
            reasons: reasons
        };
    }

    notifyChange() {
        const event = new CustomEvent("gradeChanged", {
            detail: this.getResult()
        });
        this.dispatchEvent(event);
    }
}