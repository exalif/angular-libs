import { timer } from 'rxjs';

/**
 *  Exponential Backoff Retries
 */
export class BackoffRetry {
  public retryAttempts: number = 1;

  private delay: number;
  private code: number = -1;

  /**
   * @param min  Initial retry delay
   * @param max  Max retry delay
   * @param increaseFactor    Increase factor
   */
  constructor(private min = 200, private max = min * 300, private increaseFactor = 2) {
    this.delay = this.min;
  }

  /**
   * Delay Retry
   * @param code
   * @returns retryAttempts
   */
  public wait(code: number): Promise<number> {
    return new Promise(resolve => {
      if (code === this.code) {
        this.retryAttempts++;
        this.delay = Math.min(this.delay * this.increaseFactor, this.max);
      } else {
        this.delay = this.min;
        this.retryAttempts = 1;
      }

      this.code = code;

      timer(this.delay + Math.floor(Math.random() * this.min)).subscribe(() => {
        resolve(this.retryAttempts);
      });
    });
  }

  /**
   * Reset Retry
   */
  public reset(): void {
    this.delay = this.min;
    this.retryAttempts = 1;
    this.code = -1;
  }
}
