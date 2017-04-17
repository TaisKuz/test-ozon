import '../styles/main.styl';
import $ from 'jquery';
import Promise from 'promise-polyfill';
import fetchJsonp from 'fetch-jsonp';

let MainPage = React.createClass({

  //Есть API для «Instagram», надо вывести результат выполнения запроса по предоставленному макету.
  // При нажатии на сердце, должен быть отображен alert с идентификатором соответствующей записи.  
  // Код должен быть написан максимально грамотно, так будто этот код планируется использовать и дальше использовать.
  // Среднее время выполнения 2-3 часа. Страница должна получиться адаптивной (в макете изображено два состояния)
  //   Url:   https://api.instagram.com/v1/users/691623/media/recent
  // Method:   GET
  // Query String Parameters:
  //   access_token = 691623.1419b97.479e4603aff24de596b1bf18891729f3
  //   count = 20

  getInitialState: function() {
    return {
      InstaItems: []
    };
  },

  componentDidMount(){
    this.getInstagramItems();
  },

  getInstagramItems(){
    //make request to instagram API and render when all of items are ready

    let mainthis = this,
      token = '691623.1419b97.479e4603aff24de596b1bf18891729f3',
      num_photos = 20,
      InstaItems = [];

    $.ajax({
      url: 'https://api.instagram.com/v1/users/691623/media/recent',
      dataType: 'jsonp',
      type: 'GET',
      data: {access_token: token, count: num_photos},
      success: function(data){
        console.log("success", data);

        if(data.data){
          //get dat from response
          InstaItems = data.data.map((item, index) => {

            let createdTime = Math.floor((new Date().getTime() - new Date(item.created_time * 1000).getTime()) / (60 * 60 * 1000));

            if (createdTime >= 24) createdTime = Math.ceil(createdTime / 24) + 'd';
            else createdTime += 'h';

            return (
              <div key={index} className='instagramItem'>
                <div className='instagramItem-header'>
                  <img className='instagramItem-userIcon' src={item.user.profile_picture}/>
                  <div className='instagramItem-titleWrapper'>
                    <div className='instagramItem-userName'>
                      {item.user.username}
                    </div>
                    <div className='instagramItem-location'>
                      {item.user.location ? item.user.location : ''}
                    </div>
                    <div className='instagramItem-createdTime'>
                      {createdTime}
                    </div>
                  </div>
                </div>
                <img className='instagramItem-img' src={item.images.low_resolution.url}/>
                <div className='instagramItem-descriptionWrapper'>
                  <div className='instagramItem-iconHeart' onClick={function () {
                    alert('ID = ' + item.id);
                  }}/>
                  <div className='instagramItem-likesCount'>
                    {item.likes.count}
                  </div>
                  <div className='instagramItem-description'>
                    {item.caption ? item.caption.text : ''}
                  </div>
                </div>
              </div>
            );
          });
          //set state and re render when all of instagram items are ready
          mainthis.setState({InstaItems: InstaItems});
        }
      },
      error: function(data){
        console.log('error', data);
      }
    });
  },

  getInstagramItemsWithFetch(){
    // this way is not to use JQuery
    // but I had an error in response json:
      //code: 400
      //error_message: "Missing client_id or access_token URL parameter."
      //error_type: "OAuthParameterException"

    let mainthis = this,
      token = '691623.1419b97.479e4603aff24de596b1bf18891729f3',
      num_photos = 20,
      url = `https://api.instagram.com/v1/users/691623/media/recent?https://api.instagram.com/v1/users/691623/media/recent?access_token=${token}&count=${num_photos}`;
      InstaItems = [];

    fetchJsonp(url)
      .then(response => {
        return response.json();
      }).then(function(json) {

      if(json.data){
        //get dat from response
        InstaItems = json.data.map((item, index) => {

          let createdTime = Math.floor((new Date().getTime() - new Date(item.created_time * 1000).getTime()) / (60 * 60 * 1000));

          if (createdTime >= 24) createdTime = Math.ceil(createdTime / 24) + 'd';
          else createdTime += 'h';

          return (
            <div key={index} className='instagramItem'>
              <div className='instagramItem-header'>
                <img className='instagramItem-userIcon' src={item.user.profile_picture}/>
                <div className='instagramItem-titleWrapper'>
                  <div className='instagramItem-userName'>
                    {item.user.username}
                  </div>
                  <div className='instagramItem-location'>
                    {item.user.location ? item.user.location : ''}
                  </div>
                  <div className='instagramItem-createdTime'>
                    {createdTime}
                  </div>
                </div>
              </div>
              <img className='instagramItem-img' src={item.images.low_resolution.url}/>
              <div className='instagramItem-descriptionWrapper'>
                <div className='instagramItem-iconHeart' onClick={function () {
                  alert('ID = ' + item.id);
                }}/>
                <div className='instagramItem-likesCount'>
                  {item.likes.count}
                </div>
                <div className='instagramItem-description'>
                  {item.caption ? item.caption.text : ''}
                </div>
              </div>
            </div>
          );
        });
        //set state and re render when all of instagram items are ready
        mainthis.setState({InstaItems: InstaItems});
      }
    }).catch(alert);
  },

  render() {
    return (
      <div className="main">
        <div className="main-contentWrapper">
          {this.state.InstaItems}
        </div>
      </div>
    );
  }
});

ReactDOM.render(<MainPage />, document.getElementById('content'));
