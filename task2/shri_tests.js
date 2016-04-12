function assert(value) {
    if (value == true) {
        console.log('passed');
    } else {
        console.log('not passed');
    }
}

(function () {
    console.log('shri createTeam() test 1:');

    var shri = new SHRI(); // Arrange

    shri.createTeam('team1'); // Act

    var team = shri.getTeam('team1'); // Assert
    assert(team.name == 'team1');
})();

(function () {
    console.log('shri createTeam() test 2:');

    var shri = new SHRI(); // Arrange

    shri.createTeam('team1'); // Act
    shri.createTeam('team2');

    var team = shri.getTeam('team2'); // Assert
    assert(team.name == 'team2');
})();

(function () {
    console.log('team addStudent() test 1:');

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