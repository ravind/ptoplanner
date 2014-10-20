namespace PtoPlanner.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedSettings : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Settings",
                c => new
                    {
                        PersonId = c.String(nullable: false, maxLength: 128),
                        SettingsYear = c.Int(nullable: false),
                        PtoCarriedOver = c.Decimal(nullable: false, precision: 18, scale: 2),
                        HireYear = c.Int(nullable: false),
                        EmployeeStatus = c.Int(nullable: false),
                        ProrateStart = c.DateTime(),
                        ProrateEnd = c.DateTime(),
                    })
                .PrimaryKey(t => new { t.PersonId, t.SettingsYear });
            
            AlterColumn("dbo.Pto", "PersonId", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Pto", "PersonId", c => c.String());
            DropTable("dbo.Settings");
        }
    }
}
