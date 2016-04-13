function assert(value) {
    if (value == true) {
        console.log('passed');
    } else {
        console.log('not passed');
    }
}

(function () {
    console.log('SHRI createTeam() test 1:');
    var shri = new SHRI(); // Arrange
    shri.createTeam('team1'); // Act
    shri.createTeam('team2');
    var team1 = shri.getTeam('team1');
    var team2 = shri.getTeam('team2'); // Assert
    assert(team1.name == 'team1');
    assert(team2.name == 'team2');
})();

(function () {
    console.log('Team addStudent() test 1:');

    var shri = new SHRI(); // Arrange
    shri.createTeam("Group2016-1");

    var team = shri.getTeam("Group2016-1");
    team.addStudent(new Student("Иванов Иван")); // Act
    team.addStudent(new Student("Петров Иннокентий"));
    team.addStudent(new Student("Сазонов Павел"));

    assert(team.students.some(function (s) { return s.name == "Иванов Иван" })); // Assert
    assert(team.students.some(function (s) { return s.name == "Петров Иннокентий" }));
    assert(team.students.some(function (s) { return s.name == "Сазонов Павел" }));
    assert(team.students.length == 3);
})();

(function () {
    console.log('Creating individual task, test 1:');
    var student = new Student("Иванов Иван"); // Arrange    
    student.createTask("Вёрстка интерфейса поисковой системы."); // Act    
    assert(student.tasks.some(function (t) { return t.name == "Вёрстка интерфейса поисковой системы."; })); // Assert
})();

(function () {
    console.log('Creating team tasks, test 1');

    var team = new Team('Group2016-1');
    team.createTask("Задача 1");
    team.createTask("Задача 671");

    assert(team.tasks.some(function (t) { return t.name == 'Задача 1'; }));
    assert(team.tasks.some(function (t) { return t.name == 'Задача 671'; }));
    assert(team.tasks.length == 2);
})();

(function () {
    console.log('Setting a grade for a task, test 1');
    var student = new Student("Иванов Иван");
    student.createTask("АБВГД");
    student.createTask("Задача #444");
    student.setGradeForTask("Задача #444", 10);

    var task = student.getTask("Задача #444");
    assert(task.grade == 10);
})();

(function () {
    console.log('Creating prioritized list of students for a mentor, test');
    var mentor = new Mentor("Гуру Гуруев");
    var stud1 = new Student("Иванов Иван");
    var stud2 = new Student("Сидоров Сидор");

    mentor.addStudentWithPriority(stud1, 98);
    mentor.addStudentWithPriority(stud2, 67);

    assert(mentor.prioritizedSudents.length == 2);
    assert(mentor.prioritizedSudents.some(function (ps) { return ps.student.name == "Иванов Иван"; }));
    assert(mentor.prioritizedSudents.some(function (ps) { return ps.student.name == "Сидоров Сидор"; }));
})();