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

// Subject Base Class //////////////////////////////////////////
function Subject(name) {
    this.name = name;
    this.tasks = [];
}

Subject.prototype.createTask = function (name) {
    this.tasks.push(new Task(name));
}

Subject.prototype.getTask = function (name) {
    for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].name == name) {
            return this.tasks[i];
        }
    }
    return null;
}

Subject.prototype.setGradeForTask = function (name, value) {
    var task = this.getTask(name);
    task.grade = value;
}

// class Student : Subject ///////////////////////////////////// 
function Student(name) {
    Subject.apply(this, arguments);
}

Student.prototype = new Subject();
Student.prototype.constructor = Student;

// class Team : Subject ////////////////////////////////////////
function Team(name) {
    Subject.apply(this, arguments);
    this.students = [];
}

Team.prototype = new Subject();
Team.prototype.constructor = Team;

Team.prototype.addStudent = function (student) {
    this.students.push(student);
}

// class Task ///////////////////////////////////////////////////
function Task(name) {
    this.name = name;
    this.grade = undefined;
}

// class Mentor
function Mentor(name) {
    this.name = name;
    this.prioritizedStudents;
}