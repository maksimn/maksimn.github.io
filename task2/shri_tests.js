function assert(value) {
    value == true ? console.log('passed') : console.log('not passed');
}

(function () {
    console.log('shri.createTeam() test 1:');
    var shri = new SHRI();

    var team = shri.createTeam('team1'); // Act

    assert(team.name == 'team1'); // Assert
})();

(function () {
    console.log('Team.addStudent() test 1:');
    var shri = new SHRI();
    var team = shri.createTeam("T1"); // Arrange

    team.addStudent(shri.createStudent("a")); // Act
    team.addStudent(shri.createStudent("b"));
    team.addStudent(shri.createStudent("c"));

    assert(team.student('a').name == "a"); // Assert
    assert(team.student('b').name == "b");
    assert(team.student('c').name == "c");
    assert(team.students.length == 3);
})();

(function () {
    console.log('Creating individual task, test 1:');
    var shri = new SHRI();
    var student = shri.createStudent("a"); // Arrange
    var task = shri.createTask('t1');
    
    student.addTask(task); // Act

    assert(student.task("t1").name == "t1"); // Assert
})();

(function () {
    console.log('Creating team tasks, test 1');
    var shri = new SHRI();
    var team = shri.createTeam('T1');

    team.addTask(shri.createTask("t1"));
    team.addTask(shri.createTask("t2"));

    assert(team.task("t1").name == "t1");
    assert(team.task("t2").name == "t2");
    assert(team.tasks.length == 2);
})();

(function () {
    console.log('Setting a grade for a task, test 1');
    var shri = new SHRI();
    var student = shri.createStudent("Иванов Иван");
    student.addTask(shri.createTask("АБВГД"));
    student.addTask(shri.createTask("Задача #444"));
    student.task("Задача #444").grade(10); // выставление оценки за задание

    var task = student.task("Задача #444");
    assert(task.grade() == 10);
})();

(function () {
    console.log('Creating list of students for a mentor, test 1');
    var shri = new SHRI();
    var mentor = shri.createMentor("A");
    var stud1 = shri.createStudent("a");
    var stud2 = shri.createStudent("b");

    mentor.addStudent(stud1);
    mentor.addStudent(stud2);

    assert(mentor.student('a').name == 'a');
    assert(mentor.student("b").name == 'b');
})();

(function () {
    console.log("Set student priority for a mentor.");
    var shri = new SHRI();
    var mentor = shri.createMentor("A");
    var student = shri.createStudent("B");
    mentor.addStudent(student);

    mentor.studentPriority('B', 55);

    assert(mentor.studentPriority('B') == 55);
})();

(function () {
    console.log("Set mentor priority for a student.");
    var shri = new SHRI();
    var mentor = shri.createMentor("A");
    var mentor2 = shri.createMentor("C");
    var student = shri.createStudent("B");

    student.addMentor(mentor);
    student.addMentor(mentor2);

    student.mentorPriority('C', 55);

    assert(student.mentorPriority("C") == 55);
})();

(function () {
    console.log("Student distribution between mentors, test");
    var shri = new SHRI();
    var mentor1 = shri.createMentor("A");
    var mentor2 = shri.createMentor("B");
    var student1 = shri.createStudent("a");
    var student2 = shri.createStudent("b");
    var student3 = shri.createStudent("c");

    mentor1.addStudent(student3);
    mentor1.studentPriority(student3.name, 4);
    mentor1.addStudent(student2);
    mentor1.studentPriority(student2.name, 9);
    mentor2.addStudent(student2);
    mentor2.studentPriority(student2.name, 8);
    mentor2.addStudent(student3);
    mentor2.studentPriority(student3.name, 5);
    mentor2.addStudent(student1);
    mentor2.studentPriority(student1.name, 4);

    student1.addMentor(mentor1);
    student1.addMentor(mentor2);
    student2.addMentor(mentor1);
    student2.addMentor(mentor2);
    student3.addMentor(mentor1);
    student3.addMentor(mentor2);
    student1.mentorPriority(mentor1.name, 1);
    student1.mentorPriority(mentor2.name, 2);
    student2.mentorPriority(mentor1.name, 1);
    student2.mentorPriority(mentor2.name, 2);
    student3.mentorPriority(mentor1.name, 2);
    student3.mentorPriority(mentor2.name, 1);

    var result = shri.distribute();

    assert(result[0].studnames.some(function (x) { return x == "c"; })
           && result[1].studnames.some(function (x) { return x == "a"; })
           && result[1].studnames.some(function (x) { return x == "b"; }));
})();