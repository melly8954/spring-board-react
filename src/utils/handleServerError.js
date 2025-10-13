const handleServerError = (error) => {
  console.log('응답 오류:', error);
  if (error.response.data.message) {
    alert(error.response.data.message);
  } else {
    alert('서버 오류가 발생했습니다.');
  } 
}

export default handleServerError;