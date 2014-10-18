namespace PtoPlanner.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangePersonIdType : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Pto",
                c => new
                    {
                        PtoId = c.Int(nullable: false, identity: true),
                        PersonId = c.String(),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        Note = c.String(),
                        HalfDays = c.Boolean(nullable: false),
                        PtoType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PtoId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Pto");
        }
    }
}
