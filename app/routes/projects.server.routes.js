'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var projects = require('../../app/controllers/projects.server.controller');
    var comment = require('../../app/controllers/comment.server.controller');
    var votes = require('../../app/controllers/votes.server.controller');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();


    // Projects Routes
    app.route('/projects')
        .get(projects.list)
        .post(users.requiresLogin, projects.create);

    app.route('/projects/img/:projectId/:fileName')
        .post(multipartMiddleware, projects.saveImg)
        .get(projects.getImg);


    app.route('/projects/:projectId')
        .get(projects.read)
        .put(users.requiresLogin, projects.hasAuthorization, projects.update)
        .delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

    app.route('/projects/:projectId/comment')
        .post(users.requiresLogin, comment.create)
        .get(comment.list);

    app.route('/projects/:projectId/comment/:commentId')
        .delete(comment.delete);

    app.route('/projects/:projectId/votes')
        .post(users.requiresLogin, votes.hasVoted, votes.create)
        .get(votes.list);

    app.route('/projects/:projectId/votes/:voteId')
        .put(users.requiresLogin, votes.update)
        .delete(users.requiresLogin, votes.delete);

    app.param('commentId', comment.commentByID);
    app.param('voteId', votes.voteByID);
    // Finish by binding the Project middleware
    app.param('projectId', projects.projectByID);
    app.param('fileName', projects.getFileName);
};
