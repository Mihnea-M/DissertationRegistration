const statusOrder = [
    "pending",
    "approved",
    "studentFileUploaded",
    "fileRejectedByProfessor",
    "completed",
    "rejected"
  ];
  
  function orderRequestsByStatus(requests) {
    return requests.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  }
  
  export { orderRequestsByStatus };