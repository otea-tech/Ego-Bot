const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: '❌ You cannot warn yourself!',
        ephemeral: true,
      });
    }

    if (user.bot) {
      return interaction.reply({
        content: '❌ You cannot warn a bot!',
        ephemeral: true,
      });
    }

    // Add warning to database
    Database.addWarning(
      interaction.guildId,
      user.id,
      interaction.user.id,
      reason
    );

    const warnCount = Database.getWarningCount(interaction.guildId, user.id);

    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('⚠️ User Warned')
      .addFields(
        { name: 'User', value: `${user.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Total Warnings', value: `${warnCount}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('You have been warned!')
            .addFields(
              { name: 'Server', value: interaction.guild.name },
              { name: 'Moderator', value: interaction.user.tag },
              { name: 'Reason', value: reason },
              { name: 'Total Warnings', value: `${warnCount}` }
            )
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log('Could not send DM to user');
    }

    await interaction.reply({ embeds: [embed] });
  },
};
