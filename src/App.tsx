import DominantColorImage from "./components/DominantColorImage";

function App() {
  return (
    <>
      <div>
        <DominantColorImage
          imageUrl={
            "https://image.simplecastcdn.com/images/a295c480-0f10-4883-995e-595fa4bb2a56/66c9fbf0-7076-4098-8e83-1dccbada0afd/3000x3000/sbf.jpg?aid=rss_feed"
          }
        />
      </div>
    </>
  );
}

export default App;
