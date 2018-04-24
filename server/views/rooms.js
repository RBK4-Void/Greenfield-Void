angular.module('app1')
.component('rooms', {
	controller : function($scope,$http,$window){
		$http({
			method : "GET",
			url : "/createroom"
		}).then(function Success(response) {
			$scope.rooms = response.data;
			console.log(response.data)
			
		});

		this.createroom=(name) =>{
			$http({
				method:'POST',
				url:'/createroom',
				data:{roomname:name},
				headers:{'Content-Type':'application/json'}
			}).then(function onSuccess(response){
				setTimeout(function(){ 
					$window.location.reload();
				}, 200);
			}).catch(function(response) {
				var x = (response.data)
				alert(x,response.status);
			})
			
		}

	},

	templateUrl:'rooms.html'
})