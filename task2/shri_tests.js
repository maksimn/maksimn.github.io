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

