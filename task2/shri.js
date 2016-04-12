var SHRI = (function () {
    function shri() {
        this.teams = [];
    }
    
    shri.prototype.createTeam = function (name) {
        this.teams.push(new Team(name));
    }

    shri.prototype.getTeam = function (name) {
        for (var i = 0; i < this.teams.length; i++) {
            if (this.teams[i].name == name) {
                return this.teams[i];
            }
        }
        return null;
    }

    return shri;
})();

function Student(name) {
    this.name = name;
}

function Team(name) {
    this.name = name;
    this.students = [];
}

Team.prototype.addStudent = function (student) {
    this.students.push(student);
}