var SHRI = (function () {
    function shri() {
    }
    
    shri.prototype.createTeam = function (name) {
        return new Team(name);
    }

    shri.prototype.createStudent = function (name) {
        return new Student(name);
    }

    shri.prototype.createMentor = function (name) {
        return new Mentor(name);
    }

    // Критерий распределения:
    // При распределении студент может быть приписан только к одному ментору.
    // Один ментор может взять нескольких студентов.
    // Студент может быть распределен к ментору, только если он есть в списке у этого ментора.
    // При этом условии он распределяется к самому приоритетному ментору из своего списка.
    shri.prototype.distribute = function (mentors) {
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
        function getStudents() {
            for (var i = 0; i < mentors.length; i++) {
                for (var j = 0; j < mentors[i].prioritizedStudents.length; j++) {
                    var student = mentors[i].prioritizedStudents[j].student;
                    if (!students.some(function (s) { return s.name == student.name; })) {
                        students.push(student);
                    }
                }
            }
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
        var students = [], results = [];
        prepareForDistribution();
        getStudents();
        initResultsArray();
        distribution();
        return results;
    }

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

    // class Student : Subject ///////////////////////////////////// 
    function Student(name) {
        Subject.apply(this, arguments);
        this.prioritizedMentors = [];
    }

    Student.prototype = new Subject();
    Student.prototype.constructor = Student;

    Student.prototype.addMentor = function (mentor) {
        this.prioritizedMentors.push({ mentor: mentor, priority: undefined });
    }

    Student.prototype.setPriorityForMentor = function(mentorName, value) {
        _setPriority(this.prioritizedMentors, "mentor", mentorName, value);
    }

    // class Task ///////////////////////////////////////////////////
    function Task(name) {
        this.name = name;
        this.grade = undefined;
    }

    // class Mentor
    function Mentor(name) {
        this.name = name;
        this.prioritizedStudents = [];
    }

    Mentor.prototype.addStudent = function (student) {
        this.prioritizedStudents.push({ student: student, priority: undefined });
    }

    Mentor.prototype.setPriorityForStudent = function (studentName, value) {
        _setPriority(this.prioritizedStudents, "student", studentName, value);
    }

    // Auxiliary functions ////////////////////////////////////////////
    function _setPriority(array, prop, name, value) {
        var elem = find(array, function (x) { return x[prop].name == name; }, {});
        elem.priority = value;
    }

    function find(arr, predicate, ctx) {
        var result = null;
        arr.some(function (el, i) {
            return predicate.call(ctx, el, i, arr) ? ((result = el), true) : false;
        });
        return result;
    }

    return shri;
})();