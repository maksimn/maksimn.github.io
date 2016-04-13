function assert(value) {
    value == true ? console.log('passed') : console.log('not passed');
}

(function () {
    console.log('SHRI createTeam() test 1:');
    var shri = new SHRI(); // Arrange
    var team = shri.createTeam('team1'); // Act
    assert(team.name == 'team1');
})();

(function () {
    console.log('Team addStudent() test 1:');

    var shri = new SHRI(); // Arrange
    var team = shri.createTeam("Group2016-1");
    team.addStudent(shri.createStudent("Иванов Иван")); // Act
    team.addStudent(shri.createStudent("Петров Иннокентий"));
    team.addStudent(shri.createStudent("Сазонов Павел"));

    assert(team.students.some(function (s) { return s.name == "Иванов Иван" })); // Assert
    assert(team.students.some(function (s) { return s.name == "Петров Иннокентий" }));
    assert(team.students.some(function (s) { return s.name == "Сазонов Павел" }));
    assert(team.students.length == 3);
})();

(function () {
    console.log('Creating individual task, test 1:');
    var student = new SHRI().createStudent("Иван"); // Arrange    
    student.createTask("Вёрстка интерфейса поисковой системы."); // Act    
    assert(student.tasks.some(function (t) { return t.name == "Вёрстка интерфейса поисковой системы."; })); // Assert
})();

(function () {
    console.log('Creating team tasks, test 1');

    var team = new SHRI().createTeam('Group2016-1');
    team.createTask("Задача 1");
    team.createTask("Задача 671");

    assert(team.tasks.some(function (t) { return t.name == 'Задача 1'; }));
    assert(team.tasks.some(function (t) { return t.name == 'Задача 671'; }));
    assert(team.tasks.length == 2);
})();

(function () {
    console.log('Setting a grade for a task, test 1');
    var student = new SHRI().createStudent("Иванов Иван");
    student.createTask("АБВГД");
    student.createTask("Задача #444");
    student.setGradeForTask("Задача #444", 10);

    var task = student.getTask("Задача #444");
    assert(task.grade == 10);
})();

(function () {
    console.log('Creating list of students for a mentor, test 1');
    var shri = new SHRI();
    var mentor = shri.createMentor("Гуру Гуруев");
    var stud1 = shri.createStudent("Иванов Иван");
    var stud2 = shri.createStudent("Сидоров Сидор");

    mentor.addStudent(stud1);
    mentor.addStudent(stud2);

    assert(mentor.prioritizedStudents.length == 2);
    assert(mentor.prioritizedStudents.some(function (ps) { return ps.student.name == "Иванов Иван"; }));
    assert(mentor.prioritizedStudents.some(function (ps) { return ps.student.name == "Сидоров Сидор"; }));
})();

(function () {
    console.log("Set student priority for a mentor.");
    var shri = new SHRI();
    var mentor = shri.createMentor("A");
    var student = shri.createStudent("B");
    mentor.addStudent(student);

    mentor.setPriorityForStudent("B", 55);

    assert(mentor.prioritizedStudents.some(function (ps) { return ps.student.name == "B" && ps.priority == 55; }));
})();

(function () {
    console.log("Set mentor priority for a student.");
    var shri = new SHRI();
    var mentor = shri.createMentor("A");
    var mentor2 = shri.createMentor("C");
    var student = shri.createStudent("B");
    
    student.addMentor(mentor);
    student.addMentor(mentor2);

    student.setPriorityForMentor("C", 55);

    assert(student.prioritizedMentors.some(function (pm) { return pm.mentor.name == "C" && pm.priority == 55; }));
})();