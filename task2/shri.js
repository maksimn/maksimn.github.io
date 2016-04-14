﻿var SHRI = (function () {
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
    // К данному ментору могут попасть только студенты из его списка.
    // Кроме того, этот ментор должен присутствовать в списке у студентов из своего списка и 
    // иметь больший приоритет, чем другие менторы.
    shri.prototype.distribute = function (mentors) {
        prepareForDistribution(mentors);
        var results = [];
        while(!isDistributionFinished(mentors)) {
            for (var i = 0; i < mentors.length; i++) {
                for (var j = 0; j < mentors[i].prioritizedStudents.length; j++) {
                    var student = mentors[i].prioritizedStudents[j].student;
                    if (isMentorMostPrioritizedForStudent(mentors[i], student)) {
                        disributeToResults(results, mentors, i, student);
                    }
                }
            }
        }
    }

    function isDistributionFinished(mentors) {

    }

    function isMentorMostPrioritizedForStudent(mentor, student) {

    }

    function disributeToResults(results, mentors, i, student) {

    }

    function prepareForDistribution(mentors) {
        for (var i = 0; i < mentors.length; i++) {
            var studPriority = mentors[i].prioritizedStudents;
            studPriority.sort(prioritySort);
            for (var j = 0; j < studPriority.length; j++) {
                studPriority[j].student.prioritizedMentors.sort(prioritySort);
            }
        }
    }

    function prioritySort(ps1, ps2) {
        return ps2.priority - ps1.priority;
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

    // Auxiliary functions
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