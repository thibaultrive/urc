export const envoyerMessage = async (messagePayload: any, token: any) => {
    try {
      const response = await fetch('/api/envoyerMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messagePayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send message: ${errorData.error}`);
      }
  
      return await response.json(); // Return the saved message
    } catch (error) {
      console.error('Error in envoyerMessage API:', error);
      throw error;
    }
  };
  