var Enemy = function (params) {
	var scope = this;


	scope.shooter = params.shooter;
	scope.canvas = scope.shooter.canvas;
	scope.game = scope.shooter.game;
	scope.width = scope.shooter.width;
	scope.height = scope.shooter.height;
	scope.explosion = scope.shooter.explosion;

	scope.initEnemy = function () {
		var cxStart = scope.randomY(),
			cxEnd = scope.randomY(),
			data = scope.randomData(),
			t = scope.randomTime(),
			bigR = data.scale * 15,
			smallR = data.scale * 5;		

		scope.enemy = scope.game.append('g')
			.classed('enemy ' + data.className, true)
			.attr('lives', data.lives)
			.attr('transform', 'translate(' + [scope.width + bigR, cxStart ] + ')');
		
		scope.enemy
			.transition()
			.duration(t)
				.ease('linear')
				.attr('transform', 'translate(' + [0, cxEnd] + ')')
				.remove();


		if (Math.random()*10 > 5) {
			scope.enemy.append('svg:image')
			.attr('xlink:href', 'images/enemy.svg')
                .attr('x',10)
                .attr('y', 10)
                .attr('width', 140)
                .attr('height', 100);

             scope.enemy.append('rect')
                .attr('x',10)
                .attr('y', 10)
                .attr('width', 140)
                .attr('height', 100)
                .attr('fill','black')
                .attr('opacity','0.0');
            } else {
            	scope.enemy.append('svg:image')
				.attr('xlink:href', 'images/enemym.svg')
				.attr('x',10)
                .attr('y', 10)
                .attr('width', 140)
                .attr('height', 100);

                scope.enemy.append('rect')
                .attr('x',10)
                .attr('y', 10)
                .attr('width', 140)
                .attr('height', 100)
                .attr('fill','black')
                .attr('opacity','0.0');
            }

/*d3.xml("images/enemy.svg", function(xml) {
  scope.enemy.appendChild(xml.documentElement);

  var circle = d3.select("svg").append("circle")
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 20)
            .style("fill", "red");
});*/


		/*scope.enemy.append('circle')
			.classed('lg', true)
			.attr('r', bigR);

		scope.enemy.append('circle')
			.classed('sm', true)
			.attr('r', smallR);*/

		scope.enemy.intervalId = setInterval(function () {
			var r, x, y, width, height, enemyBody, clientRect, rockets;
			
			clientRect = scope.enemy.node().getBoundingClientRect();
			
			x = clientRect.left;
			y = clientRect.top;
			width = clientRect.width;
			height = clientRect.height;

			rockets = scope.canvas.selectAll('.rocket.active')
				.each(function () {
					var rocket = d3.select(this),
						clientRect = rocket.select('.rocket-body').node().getBoundingClientRect();
					
					var lives,
						damage,
						explosion;

					if (clientRect.left >= x &&
						clientRect.left <= x + width &&
						clientRect.top >= y &&
						clientRect.top <= y + height) {

						rocket
							.transition()
							.duration(0);
						
						rocket.remove();


						explosion = d3.select(scope.explosion).select('#Page-1');

						explosion = scope.canvas.node()
							.appendChild(explosion.node().cloneNode(true));

						explosion = d3.select(explosion);

						explosion
							.attr('transform', 'translate(' +
								[clientRect.left - 10, clientRect.top - 10] +')')
							.style('opacity', 0)
							.transition()
							.duration(200)
								.style('opacity', 1);

						explosion
							.transition()
							.delay(200)
							.duration(500)
								.style('opacity', 0)
								.remove();

						damage = Math.round(Math.random() * 12 + 35);

						scope.canvas.append('text')
							.text(damage)
							.attr('x', clientRect.left + 10)
							.attr('y', clientRect.top - 5)
							.style('font-size', 20)
							.transition()
							.duration(1000)
								.style('opacity', 0)
								.style('font-size', 45)
								.remove();

						scope.shooter.updateScore(damage);
						scope.shooter.updateAccuracy({ hit: true });

						lives = parseInt(scope.enemy.attr('lives'), 10) - damage;
						scope.enemy.attr('lives', lives);

						if (lives <= 0) {
							scope.enemy.transition().duration(0);
							clearInterval(scope.enemy.intervalId);
							clearTimeout(scope.enemy.killSwitchId);

							scope.enemy
								.transition()
								.duration(600)
									.style('opacity', 0.1)
									.remove();

							scope.shooter.updateDestroyedCounter();
						}
					}
				});
		}, 30);

		scope.enemy.killSwitchId = setTimeout(function () {
			var lives = scope.enemy.attr('lives');

			clearInterval(scope.enemy.intervalId);

			if (lives > 0) {
				scope.shooter.updateHealth(lives);
			}
		}, t);

		scope.enemy
			.attr('intervalId', scope.enemy.intervalId)
			.attr('killSwitchId', scope.enemy.killSwitchId);


			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
	};

	/* Helpers */
	scope.randomTime = function () {
		return Math.random() * 15000 + 10000;
	};

	scope.randomData = function () {
		return ENEMIES[Math.floor(Math.random() * 3)];
	};

	scope.randomY = function () {
		return (scope.height/4)*(3*Math.random()+0.5);
	};

	scope.initEnemy();
};