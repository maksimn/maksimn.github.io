var SHRI = (function () {
    function shri() {
        this.teams = [];
        this.students = [];
        this.mentors = [];
    }

    shri.prototype.createTeam = function (name) {
        var len = this.teams.push(new Team(name));
        return this.teams[len - 1];
    }

    shri.prototype.createStudent = function (name) {
        var len = this.students.push(new Student(name));
        return this.students[len - 1];
    }

    shri.prototype.createTask = function (name) {
        return new Task(name);
    }

    shri.prototype.createMentor = function (name) {
        var len = this.mentors.push(new Mentor(name));
        return this.mentors[len - 1];
    }

    // Критерий распределения:
    // При распределении студент может быть приписан только к одному ментору.
    // Один ментор может взять нескольких студентов.
    // Студент может быть распределен к ментору, только если он есть в списке у этого ментора.
    // При этом условии он распределяется к самому приоритетному ментору из своего списка.
    shri.prototype.distribute = function () {
        function prepareForDistribution() {
            for (var i = 0; i < mentors.length; i++) {
                var studwithPriority = mentors[i].prioritizedStudents;
                studwithPriority.sort(prioritySort);
                for (var j = 0; j < studwithPriority.length; j++) {
                    studwithPriority[j].student.prioritizedMentors.sort(prioritySort);
                }
            }
        }
        function prioritySort(ps1, ps2) {
            return ps2.priority - ps1.priority;
        }
        function initResultsArray() {
            for (var i = 0; i < mentors.length; i++) {
                results.push({ mentorname: mentors[i].name, studnames: [] });
            }
        }
        function distribution() {
            for (var i = 0; i < students.length; i++) {
                for (var j = 0; j < students[i].prioritizedMentors.length; j++) {
                    var mentor = students[i].prioritizedMentors[j].mentor;
                    if (mentor.prioritizedStudents.some(function (ps) { return ps.student.name == students[i].name; })) {
                        var theSameMentorInResults = find(results, function (m) { return m.mentorname == mentor.name; }, {});
                        theSameMentorInResults.studnames.push(students[i].name);
                        break;
                    }
                }
            }
        }
        var students = this.students, mentors = this.mentors, results = [];
        prepareForDistribution();
        initResultsArray();
        distribution();
        return results;
    }

    // Subject Base Class //////////////////////////////////////////
    function Subject(name) {
        this.name = name;
        this.tasks = [];
    }

    Subject.prototype.addTask = function (task) {
        this.tasks.push(task);
    }

    Subject.prototype.task = function (name) {
        return find(this.tasks, function (t) { return t.name == name; }, {});
    }

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
    Team.prototype.student = function (name) {
        return find(this.students, function (s) { return s.name == name; }, {});
    }
    // class Student : Subject ///////////////////////////////////// 
    function Student(name) {
        Subject.apply(this, arguments);
        this.prioritizedMentors = [];
    }

    Student.prototype = new Subject();
    Student.prototype.constructor = Student;
    Student.prototype.addMentor = function (mentor) {
        this.prioritizedMentors.push({ mentor: mentor });
    }
    Student.prototype.mentor = function (name) {
        return find(this.prioritizedMentors, function (x) { return x.name == name; }, {}).mentor;
    }
    Student.prototype.mentorPriority = function (name, value) {
        var mentorInfo = find(this.prioritizedMentors, function (x) { return x.mentor.name == name; }, {});
        if (value !== undefined) {
            mentorInfo.priority = value;
        } else {
            return mentorInfo.priority;
        }
    }

    // class Task ///////////////////////////////////////////////////
    function Task(name) {
        this.name = name;
        this._grade = undefined;
    }

    Task.prototype.grade = function (value) {
        if (value !== undefined) {
            this._grade = value;
        } else {
            return this._grade;
        }
    }
    // class Mentor
    function Mentor(name) {
        this.name = name;
        this.prioritizedStudents = [];
    }

    Mentor.prototype.addStudent = function (student) {
        this.prioritizedStudents.push({ student: student });
    }

    Mentor.prototype.student = function (name) {
        return find(this.prioritizedStudents, function (x) { return x.student.name == name; }, {}).student;
    }

    Mentor.prototype.studentPriority = function (name, value) {
        var student = find(this.prioritizedStudents, function (x) { return x.student.name == name; }, {});
        if (value !== undefined) {
            student.priority = value;
        } else {
            return student.priority;
        }
    }

    // Auxiliary functions /////////////////////////////////////////
    function find(arr, predicate, ctx) {
        var result = null;
        arr.some(function (el, i) {
            return predicate.call(ctx, el, i, arr) ? ((result = el), true) : false;
        });
        return result;
    }

    return shri;
})();