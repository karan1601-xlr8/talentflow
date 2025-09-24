export const delay = () => 
    new Promise(resolve => 
      setTimeout(resolve, 200 + Math.random() * 1000)
    );
  
  export const maybeFail = () => {
    if (Math.random() < 0.08) {
      throw new Error('Simulated server error');
    }
  };
  