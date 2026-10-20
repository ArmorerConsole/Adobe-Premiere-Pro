#!/usr/bin/env node
// Электронный журнал студентов (JavaScript / Node.js)

const readline = require('readline');

class Student {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.grades = [];
    }

    addGrade(grade) {
        if (grade >= 0 && grade <= 100) {
            this.grades.push(grade);
        } else {
            console.log('Ошибка: оценка должна быть от 0 до 100!');
        }
    }

    getAverage() {
        if (this.grades.length === 0) return 0;
        const sum = this.grades.reduce((a, b) => a + b, 0);
        return sum / this.grades.length;
    }

    printInfo() {
        const avg = this.getAverage().toFixed(2);
        console.log(`ID: ${this.id} | Имя: ${this.name} | Средний балл: ${avg} | Оценок: ${this.grades.length}`);
    }
}

class GradeBook {
    constructor() {
        this.students = [];
        this.nextId = 1001;
    }

    addStudent(name) {
        const student = new Student(name, this.nextId);
        this.students.push(student);
        console.log(`Студент "${name}" добавлен с ID ${this.nextId}`);
        this.nextId++;
    }

    findStudent(id) {
        return this.students.find(s => s.id === id) || null;
    }

    addGradeToStudent(id, grade) {
        const s = this.findStudent(id);
        if (s) {
            s.addGrade(grade);
            console.log(`Оценка ${grade} добавлена студенту ${s.name}`);
        } else {
            console.log(`Студент с ID ${id} не найден!`);
        }
    }

    showAllStudents() {
        if (this.students.length === 0) {
            console.log('Список студентов пуст.');
            return;
        }
        console.log('\n=== Список студентов ===');
        this.students.forEach(s => s.printInfo());
        console.log('========================');
    }

    showStudentDetails(id) {
        const s = this.findStudent(id);
        if (!s) {
            console.log('Студент не найден!');
            return;
        }
        console.log('\n--- Детали студента ---');
        s.printInfo();
        if (s.grades.length > 0) {
            console.log('Все оценки: ' + s.grades.join(', '));
        } else {
            console.log('Оценок пока нет.');
        }
        console.log('-----------------------');
    }

    removeStudent(id) {
        const index = this.students.findIndex(s => s.id === id);
        if (index !== -1) {
            this.students.splice(index, 1);
            console.log(`Студент с ID ${id} удалён.`);
        } else {
            console.log(`Студент с ID ${id} не найден.`);
        }
    }

    showStatistics() {
        if (this.students.length === 0) {
            console.log('Нет данных для статистики.');
            return;
        }

        let totalAvg = 0;
        let countWithGrades = 0;
        let maxAvg = -1;
        let minAvg = 101;
        let topStudent = '';
        let bottomStudent = '';

        for (const s of this.students) {
            if (s.grades.length === 0) continue;
            const avg = s.getAverage();
            totalAvg += avg;
            countWithGrades++;
            if (avg > maxAvg) {
                maxAvg = avg;
                topStudent = s.name;
            }
            if (avg < minAvg) {
                minAvg = avg;
                bottomStudent = s.name;
            }
        }

        console.log('\n=== Статистика ===');
        console.log(`Всего студентов: ${this.students.length}`);
        if (countWithGrades > 0) {
            console.log(`Средний балл по группе: ${(totalAvg / countWithGrades).toFixed(2)}`);
            console.log(`Лучший студент: ${topStudent} (${maxAvg.toFixed(2)})`);
            console.log(`Студент с самым низким баллом: ${bottomStudent} (${minAvg.toFixed(2)})`);
        } else {
            console.log('У студентов пока нет оценок.');
        }
        console.log('==================');
    }
}

function printMenu() {
    console.log('\n========== Электронный журнал ==========');
    console.log('1. Добавить студента');
    console.log('2. Добавить оценку студенту');
    console.log('3. Показать всех студентов');
    console.log('4. Показать детали студента');
    console.log('5. Удалить студента');
    console.log('6. Показать статистику');
    console.log('0. Выход');
    console.log('========================================');
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    const book = new GradeBook();

    console.log('Добро пожаловать в простой электронный журнал студентов!');

    // Добавим несколько студентов для примера
    book.addStudent('Иван Петров');
    book.addStudent('Анна Сидорова');
    book.addStudent('Алексей Козлов');
    book.addGradeToStudent(1001, 85.5);
    book.addGradeToStudent(1001, 90.0);
    book.addGradeToStudent(1002, 78.0);
    book.addGradeToStudent(1002, 82.5);
    book.addGradeToStudent(1002, 91.0);
    book.addGradeToStudent(1003, 95.0);

    while (true) {
        printMenu();
        const choiceStr = await question('Выберите действие: ');
        const choice = parseInt(choiceStr, 10);

        if (isNaN(choice)) {
            console.log('Неверный ввод! Введите число.');
            continue;
        }

        switch (choice) {
            case 1: {
                const name = (await question('Введите имя студента: ')).trim();
                if (name) {
                    book.addStudent(name);
                } else {
                    console.log('Имя не может быть пустым.');
                }
                break;
            }
            case 2: {
                const idStr = await question('Введите ID студента: ');
                const gradeStr = await question('Введите оценку (0-100): ');
                const id = parseInt(idStr, 10);
                const grade = parseFloat(gradeStr);
                if (isNaN(id) || isNaN(grade)) {
                    console.log('Неверный ввод!');
                } else {
                    book.addGradeToStudent(id, grade);
                }
                break;
            }
            case 3:
                book.showAllStudents();
                break;
            case 4: {
                const idStr = await question('Введите ID студента: ');
                const id = parseInt(idStr, 10);
                if (isNaN(id)) {
                    console.log('Неверный ввод!');
                } else {
                    book.showStudentDetails(id);
                }
                break;
            }
            case 5: {
                const idStr = await question('Введите ID студента для удаления: ');
                const id = parseInt(idStr, 10);
                if (isNaN(id)) {
                    console.log('Неверный ввод!');
                } else {
                    book.removeStudent(id);
                }
                break;
            }
            case 6:
                book.showStatistics();
                break;
            case 0:
                console.log('До свидания!');
                rl.close();
                return;
            default:
                console.log('Неверный выбор. Попробуйте снова.');
        }
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
