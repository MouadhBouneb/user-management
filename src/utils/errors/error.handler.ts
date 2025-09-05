import { Logger } from "shared/services/logger.service";

class ErrorHandler extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorDetails?: any;
  public timestamp: Date;
  
  constructor(
    message: string | object, 
    statusCode: number = 500,
    errorDetails?: any,
    isOperational: boolean = true
  ) {
    // Ensure message is a string
    const messageString = typeof message === 'string' 
      ? message 
      : JSON.stringify(message);
      
    super(messageString);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorDetails = errorDetails;
    this.timestamp = new Date();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Log the error
    Logger.error(`Error ${statusCode}: ${messageString}`, {
      stack: this.stack,
      details: errorDetails,
      timestamp: this.timestamp.toISOString()
    });
  }
  
  /**
   * Create a standardized error response object
   */
  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        details: this.errorDetails
      })
    };
  }
}

export default ErrorHandler;
