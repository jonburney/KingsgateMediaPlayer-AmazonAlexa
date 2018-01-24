var feed    = require('../feed-read')
  , should  = require('should')
  , connect = require('connect')
  , _       = require('underscore')
  , fs      = require('fs')
  , serveStatic = require('serve-static');


// Serve the fixtures.
connect()
  .use(serveStatic(__dirname + "/fixtures"))
  .listen(4478);

var host = "http://127.0.0.1:4478";


// Internal: Load the fixture with the given file name from the
// fixtures directory.
// 
// name - Such as "rss.xml".
// 
// Returns String fixture data.
function load_fixture(name) {
  return fs.readFileSync(__dirname +"/fixtures/"+ name).toString()
}

var fixtures = { 
  kingsgate: load_fixture("kingsgate.xml")
};

describe("feed", function() {
  describe("fetching a single feed", function() {
    describe("local", function() {
      var articles;
      before(function(done) {
        feed(host + "/kingsgate.xml", function(err, _articles) {
          articles = _articles;
          done(err);
        });
      });
      
      it("is an Array", function() {
        articles.should.be.an.instanceof(Array);
      });
      
      it("contains articles", function() {
        articles[0].title.should.eql("Guest Speaker Stuart Bell");
      });
      
      it("attaches the feed to each article", function() {
        articles[0].feed.source.should.eql(host + "/kingsgate.xml");
        articles[0].feed.name.should.eql("KingsGate Community Church");
      });
    });
    
    describe("with redirects", function() {
      var articles;
      before(function(done) {
        feed("http://googleplusplatform.blogspot.com/feeds/posts/default"
        , function(err, _articles) {
          articles = _articles;
          done(err);
        });
      });
      
      it("is an Array of articles", function() {
        articles.should.be.an.instanceof(Array);
        articles[0].title.should.be.string;
      });
    });
  });

  it("handles RDF as RSS", function(done) {
    feed("http://rss.slashdot.org/Slashdot/slashdot", function(err, articles) {
      should.not.exist(err);
      articles.should.be.an.instanceof(Array);
      done();
    });
  });
  
  describe(".identify", function() {
    it("identifies RSS", function() {
      feed.identify(fixtures.kingsgate).should.eql("rss");
    });
  });
  
  
  describe(".rss", function() {
    describe("a simple RSS feed", function() {
      var articles;
      before(function(done) {
        feed.rss(fixtures.kingsgate, function(err, arts) {
          articles = arts;
          done(err);
        });
      });
      
      it("is an Array of articles", function() {
        articles.should.be.an.instanceof(Array);
        articles[0].should.be.an.instanceof(Object);
      });
      
      it("has a title", function() {
        articles[0].title.should.eql("Guest Speaker Stuart Bell");
      });
      
      it("has an author", function() {
        articles[0].author.should.eql("Stuart Bell");
      });
      
      it("has a link", function() {
        articles[0].link.should.eql("https://kingsgateuk.com/Media/Player.aspx?media_id=73&fullpage=True");
      });
      
      it("has content", function() {
        articles[0].content.should.containEql("Sunday service from Peterborough Regional College");
      });
      
      it("has a published date", function() {
        articles[0].published.should.be.an.instanceof(Date);
      });
      
      it("has a feed", function() {
        articles[0].feed.name.should.eql("KingsGate Community Church");
        articles[0].feed.link.should.eql("https://kingsgateuk.com");
      });
    });

  });
});
