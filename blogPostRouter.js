const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

BlogPosts.create('My Summer Vacation', 'I had a fantastic summer in Europe! The end.', 'Adam Hinkel', 'August 7, 2017');
BlogPosts.create('Modern Politics', 'This guy is presedent? Really?', 'Joe Shmoe', 'January 24, 2017');
BlogPosts.create('Fallout 4 Review', 'This is a really great game. Buy it.', 'Preston Garvey', 'May 21, 2017');


router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	//console.log(req.body)
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \'${field}\' in request body';
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	//console.log(item)
	res.status(201).json(item);
});


router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \'${field}\' in request body';
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = 'request path id (${req.params.id}) and request body id (${req.body.id}) must match';
		console.error(message);
		return res.status(400).send(message);
	}
	console.log('Updating blog post \'${req.params.id}\'');
	let updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(200).json(updatedPost);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log('Deleted blog post \'${req.params.id}\'');
	res.status(204).end();
});

module.exports = router;
