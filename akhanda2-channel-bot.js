/**
 * Akhanda 2 Telegram Channel Auto-Post Bot
 * 
 * This bot automatically posts content about the movie "Akhanda 2"
 * to a specified Telegram channel at scheduled times.
 * Each post includes a link to the main movie search bot (@BestMovieSearchHubBot).
 * 
 * Features:
 * - Scheduled posts at 9AM, 1PM, 5PM, 8PM, 11PM daily
 * - Random selection from a rich library of posts (star cast, box office, reviews, etc.)
 * - Inline button that directly opens the main movie bot
 * - SEO-friendly hashtags in each post
 * - Graceful shutdown handling
 * 
 * Deploy on Render with Node.js environment.
 */

// ==================== DEPENDENCIES ====================
const { Telegraf } = require('telegraf');        // Telegram bot framework
const express = require('express');                // Web server for Render health checks
const cron = require('node-cron');                 // Scheduler for daily posts
require('dotenv').config();                         // For local .env file (optional)

// ==================== CONFIGURATION ====================
// Load from environment variables (set these on Render)
const BOT_TOKEN = process.env.BOT_TOKEN;                               // Bot token from BotFather
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || '@Akhanda2_MovieHD'; // Your channel (change if needed)
const MAIN_BOT_USERNAME = process.env.MAIN_BOT_USERNAME || '@BestMovieSearchHubBot'; // Your main movie bot

// Exit if token is missing
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing! Set it in environment variables.');
  process.exit(1);
}

// ==================== EXPRESS SERVER FOR RENDER ====================
// Render requires a web server to keep the service alive
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoints
app.get('/', (req, res) => res.send('✅ Akhanda 2 Channel Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start the express server
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});

// ==================== TELEGRAM BOT INIT ====================
const bot = new Telegraf(BOT_TOKEN);

// ==================== POST CONTENT LIBRARY ====================
/**
 * Array of post objects.
 * Each object can have:
 * - type: 'text' (more types like 'photo' can be added later)
 * - content: the message text (Markdown supported, includes hashtags)
 * 
 * These posts are designed to be engaging and SEO-friendly.
 */
const POSTS = [
  // 1. Movie Introduction
  {
    type: 'text',
    content: `🔥 **Akhanda 2 – The Mass Blockbuster** 🔥

🎬 **Starring:** Nandamuri Balakrishna, Samyuktha
📅 **Release:** December 2025
🌍 **Languages:** Telugu, Hindi Dubbed, Tamil, Kannada, Malayalam

👇 **Full Movie Download:**
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #Akhanda2Movie #Balakrishna #SouthMovie #TeluguMovie #HindiDubbed #Blockbuster2026`
  },

  // 2. Balakrishna's Power-packed Performance
  {
    type: 'text',
    content: `⚡ **Balakrishna's Mass Entry** ⚡

*"Yeh andhi nahi, aandhi hai!"*

Nandamuri Balakrishna's power-packed performance that will blow your mind!

📥 Watch the full movie here:
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #Balakrishna #MassMaharaj #SouthCinema #Action`
  },

  // 3. Box Office Collection Update
  {
    type: 'text',
    content: `💰 **Box Office Update** 💰

🇮🇳 **India:** ₹50 crore+ (Day 1)
🌎 **Worldwide:** ₹100 crore+ (Opening Weekend)

🚀 Biggest opener of the year for a dubbed movie!

Watch now:
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #BoxOffice #Blockbuster #RecordBreaker`
  },

  // 4. Star Cast Details
  {
    type: 'text',
    content: `🌟 **Star Cast** 🌟

⭐ Nandamuri Balakrishna
⭐ Samyuktha
⭐ Jagapathi Babu
⭐ Prakash Raj
⭐ Srikanth

🔥 All stars in one epic film!
📥 Download: ${MAIN_BOT_USERNAME}

#Akhanda2 #StarCast #Balakrishna #Samyuktha #SouthIndianCinema`
  },

  // 5. Movie Details (Runtime, Director, Budget)
  {
    type: 'text',
    content: `⏰ **Movie Details**

🎥 **Runtime:** 2 hours 50 minutes
🌍 **Languages:** Telugu, Hindi Dubbed, Tamil, Kannada, Malayalam
🎬 **Director:** Boyapati Srinu
💰 **Budget:** ₹100 crore+

Watch in your preferred language:
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #MovieDetails #BoyapatiSrinu #TeluguCinema #PanIndia`
  },

  // 6. Action Sequences
  {
    type: 'text',
    content: `💥 **Action Spectacle** 💥

Balakrishna's never-before-seen action sequences!
High-octane fights, massive explosions, and breathtaking stunts.

Experience the action:
📥 ${MAIN_BOT_USERNAME}

#Akhanda2 #Action #MassScenes #Balakrishna #Fights`
  },

  // 7. Audience Reviews
  {
    type: 'text',
    content: `⭐ **Audience Reviews** ⭐

*"Balakrishna's career-best performance! 5/5"*
*"Mass maharaj ki wapasi – full entertainment!"*
*"Action, drama, emotion – everything perfect"*

Add your review after watching:
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #Reviews #AudienceResponse #MustWatch`
  },

  // 8. Record Breaker
  {
    type: 'text',
    content: `🏆 **Record Breaker** 🏆

✅ Highest opening day for Balakrishna
✅ ₹50 crore+ advance bookings
✅ Released in 5 languages
✅ Fastest ₹100 crore in dubbed category

Be part of history:
📥 ${MAIN_BOT_USERNAME}

#Akhanda2 #Records #History #Blockbuster #Balakrishna`
  },

  // 9. Fan Craze
  {
    type: 'text',
    content: `🎉 **Fan Craze** 🎉

Theatres packed, social media trending worldwide!
Akhanda 2 has taken the nation by storm.

Join the craze:
📥 ${MAIN_BOT_USERNAME}

#Akhanda2 #FanCraze #Viral #MassHysteria #BalakrishnaFans`
  },

  // 10. Download Link Post
  {
    type: 'text',
    content: `📥 **Download Akhanda 2 Full Movie** 📥

✅ HD Quality – 1080p, 720p, 480p
✅ Telugu + Hindi Dubbed + Tamil + Kannada + Malayalam
✅ Fast download speed (Terabox/Doodstream)

👇 Download now:
👉 ${MAIN_BOT_USERNAME}

#Akhanda2 #Download #HDMovie #TeluguMovie #HindiDubbed #SouthIndianCinema`
  }
];

// ==================== FUNCTION TO SEND RANDOM POST WITH BUTTON ====================
/**
 * Picks a random post from the library and sends it to the channel with an inline button.
 * The button opens the main movie bot.
 */
async function sendRandomPost() {
  try {
    // Pick a random post from the library
    const randomIndex = Math.floor(Math.random() * POSTS.length);
    const post = POSTS[randomIndex];
    
    console.log(`📤 Sending post #${randomIndex + 1} at ${new Date().toLocaleString()}`);
    
    // Only text posts are supported for now (can be extended)
    if (post.type === 'text') {
      await bot.telegram.sendMessage(CHANNEL_USERNAME, post.content, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            // Button that redirects to the main movie bot
            [{ text: '📥 Download Now', url: `https://t.me/${MAIN_BOT_USERNAME.replace('@', '')}` }]
          ]
        }
      });
      console.log('✅ Post sent successfully with button!');
    }
    // Future: add support for photo, video, etc.
    
  } catch (error) {
    console.error('❌ Failed to send post:', error.message);
    if (error.response) {
      console.error('Telegram API response:', error.response);
    }
  }
}

// ==================== SCHEDULED POSTS ====================
/**
 * Cron schedule format: minute hour day month day-of-week
 * Times are in UTC. Adjust if needed (Render uses UTC).
 * Examples:
 *   '0 9 * * *'    – 9:00 AM UTC (2:30 PM IST)
 *   '0 13 * * *'   – 1:00 PM UTC (6:30 PM IST)
 *   '0 17 * * *'   – 5:00 PM UTC (10:30 PM IST)
 *   '0 20 * * *'   – 8:00 PM UTC (1:30 AM IST next day)
 *   '0 23 * * *'   – 11:00 PM UTC (4:30 AM IST next day)
 * 
 * If you want IST times, you may need to adjust or use a timezone library.
 * For simplicity, we keep UTC times as is.
 */

// 8:00 AM IST (2:30 AM UTC)
cron.schedule('30 2 * * *', () => {
  console.log('⏰ Scheduled: 8:00 AM IST');
  sendRandomPost();
});

// 12:00 PM IST (6:30 AM UTC)
cron.schedule('30 6 * * *', () => {
  console.log('⏰ Scheduled: 12:00 PM IST');
  sendRandomPost();
});

// 3:00 PM IST (9:30 AM UTC)
cron.schedule('30 9 * * *', () => {
  console.log('⏰ Scheduled: 3:00 PM IST');
  sendRandomPost();
});

// 6:00 PM IST (12:30 PM UTC)
cron.schedule('30 12 * * *', () => {
  console.log('⏰ Scheduled: 6:00 PM IST');
  sendRandomPost();
});

// 9:00 PM IST (3:30 PM UTC)
cron.schedule('30 15 * * *', () => {
  console.log('⏰ Scheduled: 9:00 PM IST');
  sendRandomPost();
});

// ==================== STARTUP ====================
// Launch the bot (polling mode – works fine on Render)
bot.launch().catch((err) => {
  console.error('❌ Bot failed to start:', err);
});

// Immediately log bot started message
console.log('🤖 Akhanda 2 Channel Bot started!');
console.log(`📢 Channel: ${CHANNEL_USERNAME}`);
console.log(`🔗 Main Bot: ${MAIN_BOT_USERNAME}`);
console.log('⏰ Scheduled posts at (IST): 8AM, 12PM, 3PM, 6PM, 9PM daily');

// Send a test post 1 minute after startup to verify everything works
setTimeout(() => {
  console.log('🧪 Sending test post...');
  sendRandomPost();
}, 60000); // 60 seconds

// ==================== GRACEFUL SHUTDOWN ====================
// Handle termination signals
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
