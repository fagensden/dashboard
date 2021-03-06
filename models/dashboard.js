NEWSCHEMA('Dashboard').make(function(schema) {

	schema.define('id', 'UID');
	schema.define('name', 'String(50)', true);
	schema.define('group', 'String(50)');
	schema.define('data', 'String', true);

	schema.setQuery(function(error, controller, callback) {
		NOSQL('dashboard').find().where('user', controller.user.id).callback((err, response) => callback(response));
	});

	schema.setSave(function(error, model, controller, callback) {
		var plain = model.$plain();

		if (!model.id) {
			plain.id = UID();
			plain.user = controller.user.id;
			plain.datecreated = new Date();
			NOSQL('dashboard').insert(plain).callback(() => callback(SUCCESS(true, plain.id)));
			return;
		}

		delete plain.id;
		NOSQL('dashboard').modify(plain).where('id', model.id).where('user', controller.user.id).callback(() => callback(SUCCESS(true)));
	});

	schema.setRemove(function(error, controller, callback) {
		NOSQL('dashboard').remove().where('id', controller.id).where('user', controller.user.id).callback(() => callback(SUCCESS(true)));
	});
});